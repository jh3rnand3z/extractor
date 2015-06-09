# -*- coding: utf-8 -*-
'''
    Extractor HTTP base handlers.
'''

# This file is part of extractor.

# Distributed under the terms of the last AGPL License.
# The full license is in the file LICENCE, distributed as part of this software.

__author__ = 'Jean Chassoul'

import os
import uuid
import base64
import logging

from tornado import gen
from tornado import web

from zmq.eventloop import ioloop

from extractor.tools import errors, check_json


__UPLOADS__ = "uploads/"


def get_command(msg):
    print("Received control command: %s" % msg)
    if msg[0] == "Exit":
        print("Received exit command, client will stop receiving messages")
        should_continue = False
        ioloop.IOLoop.instance().stop()
        
def process_message(msg):
    print("Processing ... %s" % msg)


class BaseHandler(web.RequestHandler):
    '''
        System application request handler

        gente d'armi e ganti
    '''

    def initialize(self, **kwargs):
        '''
            Initialize the Base Handler
        '''
        super(BaseHandler, self).initialize(**kwargs)

        # System database
        self.db = self.settings.get('db')

        # enable cache flag
        self.cache_enabled = self.settings.get('cache_enabled')

        # System cache
        self.cache = self.settings.get('cache')

        # Page settings
        self.page_size = self.settings.get('page_size')

        # Call file settings
        self.max_retries = self.settings.get('max_retries') 
        self.retry_time = self.settings.get('retry_time')
        self.wait_time = self.settings.get('wait_time')

        # outbound settings
        self.max_calls = self.settings.get('max_calls')
        self.spool_dir = self.settings.get('spool_dir')
        self.tmp_dir = self.settings.get('tmp_dir')

    def set_default_headers(self):
        '''
            Extractor default headers
        '''
        self.set_header("Access-Control-Allow-Origin", self.settings.get('domain', 'iofun.io'))

    def get_current_username(self):
        '''
            Return the username from a secure cookie
        '''
        return self.get_secure_cookie('username')

    @gen.coroutine
    def let_it_crash(self, struct, scheme, error, reason):
        '''
            Let it crash.
        '''

        str_error = str(error)
        error_handler = errors.Error(error)
        messages = []

        if error and 'Model' in str_error:
            message = error_handler.model(scheme)

        elif error and 'duplicate' in str_error:
            
            for name, value in reason.get('duplicates'):

                if value in str_error:

                    message = error_handler.duplicate(
                        name.title(),
                        value,
                        struct.get(value)
                    )

                    messages.append(message)
            
            message = ({'messages':messages} if messages else False)

        elif error and 'value' in str_error:
            message = error_handler.value()

        elif error is not None:
            logging.warning(str_error)

            logging.error(struct, scheme, error, reason, 'master')
            
            message = {
                'error': u'nonsense',
                'message': u'there is no error'
            }

        else:
            quotes = PeopleQuotes()
            
            message = {
                'status': 200,
                'message': quotes.get()
            }

        raise gen.Return(message)


@web.stream_request_body
class StreamingBodyHandler(web.RequestHandler):

    def prepare(self):
        logging.info('UploadHandler.prepare')
    
    @gen.coroutine
    def data_received(self, data):
        fh = open(__UPLOADS__ + self.fname, 'a')
        fh.write(data)
        fh.close()
    
        logging.info('A chunk received')


class UploadHandler(BaseHandler):

    @gen.coroutine
    def post(self):
        '''
            Upload content
        '''
        # post structure
        struct = yield check_json(self.request.body)

        # format pass ()
        format_pass = (True if struct else False)
        if not format_pass and not self.request.files:
            self.set_status(400)
            self.finish({'JSON':format_pass})
            return

        logging.info('new random file received')

        # logging request query arguments
        logging.info(self.request.arguments)

        # request query arguments
        query_args = self.request.arguments

        # get the current frontend logged username
        username = self.get_current_username()

        # if the user don't provide an account we use the frontend username as last resort
        account = query_args.get('account', [username])[0]

        if self.request.files:
            filedata = self.request.files['filearg'][0]
            fname = filedata['filename']
            extn = os.path.splitext(fname)[1]
            cname = str(uuid.uuid4()) + extn
            fh = open(__UPLOADS__ + cname, 'w')
            fh.write(filedata['body'])

            message = {'message':cname + " is uploaded!! Check %s folder" %__UPLOADS__}
        else:
            #logging.info(struct)

            logging.info('lol todo bien')
            
            filedata = struct.get('filearg', None)

            cname = str(uuid.uuid4()) + '.csv'

            if filedata:
                logging.info("there's something here")
                
                fh = open(__UPLOADS__ + cname, 'w')
                
                data = filedata.split(",")[1]
                
                data = base64.b64decode(data)

                if data:
                    fh.write(data)
                else:
                    print 'shit..'

                #import csv

                #with open('eggs.csv', 'rb') as csvfile:
                #    spamreader = csv.reader(csvfile, delimiter=' ', quotechar='|')
                #    for row in spamreader:
                #        print ', '.join(row)
                print "hmmm, let's check this shit out"
            else:
                logging.warning('how are we handle this file?')
            
        self.finish({'ki':'ka'})
