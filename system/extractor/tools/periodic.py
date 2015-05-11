# -*- coding: utf-8 -*-
'''
    Extractor periodic tools.
'''

# This file is part of extractor.

# Distributed under the terms of the last AGPL License. 
# The full license is in the file LICENCE, distributed as part of this software.

__author__ = 'Jean Chassoul'


import motor

import glob
import uuid

import logging

from contextlib import contextmanager
from tornado import gen

from bson import objectid



@gen.coroutine
def get_usernames(db):
    '''        
        Get all the username accounts
    '''
    usernames = []
    try:
        query = db.accounts.find({},{'account':1, '_id':0})
        while (yield query.fetch_next):
            account = query.next_object()
            usernames.append(account)
    except Exception, e:
        logging.error(e)
        message = str(e)

    raise gen.Return(usernames)

@gen.coroutine
def get_unassigned_cdr(db):
    '''
        Periodic task that returns the unassigned CDR.
    '''
    result = []
    try:
        query = db.calls.find({
            'assigned':{'$exists':False}
        }).limit(1000)
        
        for c in (yield query.to_list()):
            result.append(c)
            
    except Exception, e:
        logging.exception(e)
        raise gen.Return(e)
    
    raise ren.Return(result)

'''
# dialer max concurrent calls
max_calls = 40
# outbound uri
uri = 'http://iofun.techgcs.com/outbound/'
# current call files
current = glob.glob('/var/spool/asterisk/outgoing/*.call')

if len(current) < max_calls:
    print 'menor a {0}'.format(max_calls)
    gen = (max_calls - len(current))
    for c in xrange(0, gen):
        contact = contacts.find_one({'account':'raymond', 'checked':False}, {'_id':0, 'uuid':1, 'phone_1':1})
        phone_number = '+1{0}'.format(contact.get('phone_1'))

        # raymond account id
        account_id = 'c6d57f4b-7915-4b8f-8e88-fb42e77cc089'
        # post request payload
        payload = {
            'Phone1': phone_number,
            'AccountID': account_id
        }
        r = requests.post(uri, params=payload)
        check = contacts.update({'uuid':contact.get('uuid')},{'$set': {'checked': True}})
else:
    print 'mayor a {0}'.format(max_calls)
'''


@gen.coroutine
def process_outbound_calls():
    '''
        Periodic task that process outbound calls.
    '''
    current = glob.glob('/var/spoo/l/asterisk/outgoing*.call')


@gen.coroutine
def process_assigned_false(db):
    '''
        Periodic task that process assigned flag on calls resource.
    '''

    result = []

    def _got_call(message, error):
        '''
            got call
        '''
        if message:
            channel = (message['channel'] if 'channel' in message else False)

            if channel:
                account = [a for a in _account_list 
                           if ''.join(('/', a['account'], '-')) in channel]

                account = (account[0] if account else False)

                if account:
                    struct = {
                        'account':account['account'],
                        'resource':'calls',
                        'id':message['_id']
                    }
                    result.append(struct)
        elif error:
            logging.error(error)
            return error
        else:
            #logging.info('got call result: %s', result)
            return result
    try:
        _account_list = yield get_usernames(db)

        db.calls.find({
            'assigned':False
        }).limit(1000).each(_got_call)
    except Exception, e:
        logging.exception(e)
        raise gen.Return(e)

@gen.coroutine
def process_assigned_records(db):
    '''
        Periodic task that process unassigned records.
    '''
    result = []

    def _got_record(message, error):
        '''
            got record
        '''
        if error:
            logging.error(error)
            return error

        elif message:
            channel = (True if 'channel' in message else False)
            # get channel the value
            channel = (message['channel'] if channel else channel)

            if channel:
                account = [a for a in _account_list
                           if ''.join(('/', a['account'], '-')) in channel]
                account = (account[0] if account else False)

                if account:
                    struct = {
                        'account':account['account'],
                        'resource':'calls',
                        'id':message['_id']
                    }
                    result.append(struct)    
        else:
            #logging.info('got record result: %s', result)
            return result

    try:
        _account_list = yield get_usernames(db)

        db.calls.find({
            'assigned':{'$exists':False}
        }).limit(1000).each(_got_record)
    except Exception, e:
        logging.exception(e)
        raise gen.Return(e)

@gen.coroutine
def assign_record(db, account, callid):
    '''
        Update record assigned flag
    '''
    try:
        result = yield db.calls.update(
            {'_id':objectid.ObjectId(callid)}, 
            {'$set': {'assigned': True,
                      'accountcode':account}}
        )

    except Exception, e:
        logging.exception(e)
        raise e

        return

    raise gen.Return(result)