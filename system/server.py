# -*- coding: utf-8 -*-
'''
    extractor system

    This is the only way for the system to collect creep.

    It is one if the few structures which can be build outside the network.
'''

# This file is part of extractor.

# Distributed under the terms of the last AGPL License.
# The full license is in the file LICENCE, distributed as part of this software.

__author__ = 'Jean Chassoul'

import zmq
import time

import logging
import random

import motor

import pylibmc as mc

#from tornado.concurrent import Future
#from tornado.escape import utf8

from tornado import ioloop
from tornado import gen
from tornado import web

from tornado.web import RequestHandler

from extractor.handlers import UploadHandler

from extractor.handlers import cuallix
from extractor.handlers import payments

from extractor.handlers import get_command
from extractor.handlers import process_message

from extractor.tools import options
from extractor.tools import indexes

from extractor.tools import periodic

from extractor.tools import new_resource

from multiprocessing import Process

from zmq.eventloop import ioloop, zmqstream


# ioloop
ioloop.install()


def server_push(port="5556"):
    '''
        PUSH process
    '''
    context = zmq.Context()
    socket = context.socket(zmq.PUSH)
    socket.bind("tcp://*:%s" % port)
    print("Running server on port: ", port)
    # serves only 5 request and dies
    for reqnum in range(10):
        if reqnum < 6:
            socket.send("Continue")
        else:
            socket.send("Exit")
            break
        time.sleep (1)

def server_pub(port="5558"):
    '''
        PUB process
    '''
    context = zmq.Context()
    socket = context.socket(zmq.PUB)
    socket.bind("tcp://*:%s" % port)
    publisher_id = random.randrange(0,9999)
    print("Running server on port: ", port)
    # serves only 5 request and dies
    for reqnum in range(10):
        # Wait for next request from client
        topic = random.randrange(8,10)
        messagedata = "server#%s" % publisher_id
        print ("%s %s" % (topic, messagedata))
        socket.send("%d %s" % (topic, messagedata))
        time.sleep(1)

def client(port_push, port_sub):
    '''
        Client process
    '''
    context = zmq.Context()
    socket_pull = context.socket(zmq.PULL)
    socket_pull.connect ("tcp://localhost:%s" % port_push)
    stream_pull = zmqstream.ZMQStream(socket_pull)
    stream_pull.on_recv(get_command)
    print("Connected to server with port %s" % port_push)

    socket_sub = context.socket(zmq.SUB)
    socket_sub.connect ("tcp://localhost:%s" % port_sub)
    socket_sub.setsockopt(zmq.SUBSCRIBE, "9")
    stream_sub = zmqstream.ZMQStream(socket_sub)
    stream_sub.on_recv(process_message)
    print("Connected to publisher with port %s" % port_sub)

    ioloop.IOLoop.instance().start()
    print("Worker has stopped processing messages.")

@gen.coroutine
def periodic_outbound_callback():
    '''
        periodic outbound callback function
    '''  
    results = yield [
        periodic.process_assigned_false(db),
        periodic.process_outbound_call(db)
    ]

    if all(x is None for x in results):
        result = None
    else:
        result = list(itertools.chain.from_iterable(results))

        for record in result:

            flag = yield periodic.assign_call(
                db,
                record.get('account'),
                record.get('uuid')
            )

            resource = yield new_resource(db, record)
    if result:
        logging.info('periodic records {0}'.format(result))


if __name__ == '__main__':
    '''
        extractor system
    '''
    # Now we can run a few servers 
    server_push_port = '5556'
    server_pub_port = '5558'
    Process(target=server_push, args=(server_push_port,)).start()
    Process(target=server_pub, args=(server_pub_port,)).start()
    Process(target=client, args=(server_push_port,server_pub_port,)).start()

    opts = options.options()

    # Set document database
    document = motor.MotorClient(opts.mongo_host, opts.mongo_port).extractor
    
    # Set memcached backend
    memcache = mc.Client(
        [opts.memcached_host],
        binary=opts.memcached_binary,
        behaviors={
            "tcp_nodelay": opts.memcached_tcp_nodelay,
            "ketama": opts.memcached_ketama
        }
    )

    # Set SQL session
    #sql = queries.TornadoSession(uri=postgresql_uri)

    # Set default database
    db = document
    
    # Set default cache 
    cache = memcache

    # logging database hosts
    logging.info('MongoDB server: {0}:{1}'.format(opts.mongo_host, opts.mongo_port))

    if opts.ensure_indexes:
        logging.info('Ensuring indexes...')
        indexes.ensure_indexes(db)
        logging.info('DONE.')

    base_url = opts.base_url

    application = web.Application(

        [
            (r'/upload/?', UploadHandler),

            # Cuallix -- API Services
            (r'/cuallix/register/?', cuallix.RegisterHandler),
            
            (r'/cuallix/customer/register/?', cuallix.CustomerRegisterHandler),
            
            (r'/cuallix/customer/search/?', cuallix.SearchCustomerHandler),

            (r'/cuallix/payment/url/?', cuallix.RequestPaymentURLHandler),

            (r'/cuallix/send/money/?', cuallix.SendMoneyHandler),

            (r'/cuallix/transactions/status/?', cuallix.StatusTransactionHandler),

            (r'/cuallix/transactions/search/?', cuallix.SearchTransactionsHandler),

            (r'/cuallix/assign/?', cuallix.AssignHandler),
            (r'/cuallix/funds/?', cuallix.LoadFundsHandler),
            (r'/cuallix/payments/?', payments.Handler),
            (r'/cuallix/settle/?', cuallix.SettleTransactionHandler),

            (r'/cuallix/payments/start/(?P<start>.*)/end/(?P<end>.*)/?', payments.Handler),
            (r'/cuallix/payments/start/(?P<start>.*)/?', payments.Handler),
            (r'/cuallix/payments/end/(?P<end>.*)/?', payments.Handler),
            (r'/cuallix/payments/page/(?P<page_num>\d+)/?', payments.Handler),
        ],

        db = db,
        cache = cache,
        debug = opts.debug,
        domain = opts.domain,
        page_size = opts.page_size,
        # cookie settings
        cookie_secret=opts.cookie_secret,
        max_retries = opts.max_retries,
        retry_time = opts.retry_time,
        wait_time = opts.wait_time,
        max_calls = opts.max_calls,
        ast_user = opts.ast_user,
        ast_group = opts.ast_group,
        spool_dir = opts.spool_dir,
        tmp_dir = opts.tmp_dir
    )

    # Tornado periodic callbacks
    #outbound_campaigns = ioloop.PeriodicCallback(periodic_outbound_callbacks, 10000)
    #outbound_campaigns.start()

    # Setting up server process
    application.listen(opts.port)
    logging.info('Listening on http://{0}:{1}'.format(opts.host, opts.port))
    ioloop.IOLoop.instance().start()