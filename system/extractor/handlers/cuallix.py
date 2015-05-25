# -*- coding: utf-8 -*-
'''
    HTTP cuallix handlers.
'''

# This file is part of extractor.

# Distributed under the terms of the last AGPL License.
# The full license is in the file LICENCE, distributed as part of this software.

__author__ = 'Jean Chassoul'


import ujson as json
import uuid
import time
import arrow
import motor

import logging

from tornado import gen
from tornado import web

from tornado import httpclient

import urllib

# import system, messages and tool for work on cuallix
from extractor.system import cuallix
from extractor.messages import cuallix as models
from extractor.tools import content_type_validation
from extractor.tools import check_json
from extractor.tools import str2bool
from extractor.tools import errors

from extractor.handlers import BaseHandler


# missing acknowledgement and become
# game is progress not perfection


@content_type_validation
class RegisterHandler(cuallix.Cuallix, BaseHandler):
    '''
        Cuallix HTTP request handlers
    '''

    @gen.coroutine
    def post(self):
        '''
            User register
        '''
        # post structure
        struct = yield check_json(self.request.body)

        # format pass ().
        format_pass = (True if struct else False)
        if not format_pass:
            self.set_status(400)
            self.finish({'JSON':format_pass})
            return

        # logging new structure
        logging.info('clx user register structure {0}'.format(str(struct)))

        # logging request query arguments
        logging.info('logging request query arguments... {0}'.format(
            str(self.request.arguments))
        )

        # request query arguments
        query_args = self.request.arguments

        # get account from new struct
        account = struct.get('account', None)

        # get current frontend logged username
        username = self.get_current_username()

        # if the user don't provide an account we use the frontend username as last resort
        account = (query_args.get('account', [username])[0] if not account else account)

        # execute user register function
        new_user = yield self.user_register(struct)

        # TODO: more work on error stuff on cuallix API services.
        if 'error' in new_user:
            scheme = 'contact' # ???
            reason = {'duplicates': [
                (scheme, 'account'),
                (scheme, 'phone_number')
            ]}
            message = yield self.let_it_crash(struct, scheme, new_user, reason)

            logging.warning(message)
            self.set_status(400)
            self.finish(message)
            return

        self.set_status(201)
        self.finish(new_user)


@content_type_validation
class CustomerRegisterHandler(cuallix.Cuallix, BaseHandler):
    '''
        Cuallix HTTP request handlers
    '''

    @gen.coroutine
    def post(self):
        '''
            Customer register
        '''
        # post structure
        struct = yield check_json(self.request.body)

        # format pass ().
        format_pass = (True if struct else False)
        if not format_pass:
            self.set_status(400)
            self.finish({'JSON':format_pass})
            return

        # logging new structure
        logging.info('clx customer register structure {0}'.format(str(struct)))

        # logging request query arguments
        logging.info('logging request query arguments... {0}'.format(
            str(self.request.arguments))
        )

        # request query arguments
        query_args = self.request.arguments

        # get account from new struct
        account = struct.get('account', None)

        # get current frontend logged username
        username = self.get_current_username()

        # if the user don't provide an account we use the frontend username as last resort
        account = (query_args.get('account', [username])[0] if not account else account)

        # execute customer register function
        new_customer = yield self.customer_register(struct)

        # TODO: more work on error stuff on cuallix API services.
        if 'error' in new_customer:
            scheme = 'contact' # ???
            reason = {'duplicates': [
                (scheme, 'account'),
                (scheme, 'phone_number')
            ]}
            message = yield self.let_it_crash(struct, scheme, new_customer, reason)

            logging.warning(message)
            self.set_status(400)
            self.finish(message)
            return

        self.set_status(201)
        self.finish(new_customer)


@content_type_validation
class AssignHandler(cuallix.Cuallix, BaseHandler):
    '''
        Cuallix HTTP request handlers
    '''

    @gen.coroutine
    def post(self):
        '''
            Assign account
        '''
        # post structure
        struct = yield check_json(self.request.body)

        # format pass ().
        format_pass = (True if struct else False)
        if not format_pass:
            self.set_status(400)
            self.finish({'JSON':format_pass})
            return

        # logging new structure
        logging.info('clx assign account structure {0}'.format(str(struct)))

        # logging request query arguments
        logging.info('logging request query arguments... {0}'.format(
            str(self.request.arguments))
        )

        # request query arguments
        query_args = self.request.arguments

        # get account from new struct
        account = struct.get('account', None)

        # get the current frontend logged username
        username = self.get_current_username()

        # if the user don't provide an account we use the frontend username as last resort
        account = (query_args.get('account', [username])[0] if not account else account)

        assign_account = yield self.assign_account(struct)

        # TODO: a little work on error stuff on cuallix API services.
        
        if 'error' in assign_account:
            scheme = 'contact'
            reason = {'duplicates': [
                (scheme, 'account'),
                (scheme, 'phone_number')
            ]}
            message = yield self.let_it_crash(struct, scheme, new_contact, reason)

            logging.warning(message)
            self.set_status(400)
            self.finish(message)
            return

        self.set_status(201)
        self.finish(assign_account)


@content_type_validation
class SettleTransactionHandler(cuallix.Cuallix, BaseHandler):
    '''
        HTTP request handlers

        Cuallix SettleTransaction
    '''

    @gen.coroutine
    def post(self):
        '''
            Settle transaction
        '''
        struct = yield check_json(self.request.body)
        
        # format pass ().
        format_pass = (True if struct else False)
        if not format_pass:
            self.set_status(400)
            self.finish({'JSON':format_pass})
            return

        # logging new structure
        logging.info('cuallix settle transaction structure {0}'.format(str(struct)))

        # logging request query arguments
        logging.info('logging request query arguments... {0}'.format(
            str(self.request.arguments))
        )

        # request query arguments
        query_args = self.request.arguments

        # get account from new struct
        account = struct.get('account', None)

        # get the current frontend logged username
        username = self.get_current_username()

        # if the user don't provide an account we use the frontend username as last resort
        account = (query_args.get('account', [username])[0] if not account else account)

        # execute the method function stuff
        settle_transaction = yield self.settle_transaction(struct)

        # TODO: a little work on error stuff on cuallix API services.
        
        if 'error' in settle_transaction:
            scheme = 'payment'
            reason = {'duplicates': [
                (scheme, 'account'),
                (scheme, 'phone_number')
            ]}
            message = yield self.let_it_crash(struct, scheme, settle_transaction, reason)

            logging.warning(message)
            self.set_status(400)
            self.finish(message)
            return

        self.set_status(201)
        self.finish(settle_transaction)


@content_type_validation
class StatusTransactionHandler(cuallix.Cuallix, BaseHandler):
    '''
        HTTP request handlers

        Cuallix StatusTransaction
    '''

    @gen.coroutine
    def post(self):
        '''
            Status transaction
        '''
        struct = yield check_json(self.request.body)
        
        # format pass ().
        format_pass = (True if struct else False)
        if not format_pass:
            self.set_status(400)
            self.finish({'JSON':format_pass})
            return

        # logging new structure
        logging.info('cuallix status transaction structure {0}'.format(str(struct)))

        # logging request query arguments
        logging.info('logging request query arguments... {0}'.format(
            str(self.request.arguments))
        )

        # request query arguments
        query_args = self.request.arguments

        # get account from new struct
        account = struct.get('account', None)

        # get the current frontend logged username
        username = self.get_current_username()

        # if the user don't provide an account we use the frontend username as last resort
        account = (query_args.get('account', [username])[0] if not account else account)

        # execute the method function stuff
        status_transaction = yield self.status_transaction(struct)

        # TODO: a little work on error stuff on cuallix API services.
        
        if 'error' in status_transaction:
            scheme = 'payment'
            reason = {'duplicates': [
                (scheme, 'account'),
                (scheme, 'phone_number')
            ]}
            message = yield self.let_it_crash(struct, scheme, status_transaction, reason)

            logging.warning(message)
            self.set_status(400)
            self.finish(message)
            return

        self.set_status(201)
        self.finish(status_transaction)


@content_type_validation
class TransactionsHandler(cuallix.Cuallix, BaseHandler):
    '''
        HTTP request handlers

        Cuallix Transactions
    '''

    @gen.coroutine
    def get(self, account=None, transaction_uuid=None, page_num=0):
        '''
            Get transactions
        '''
        # logging request query arguments
        logging.info('request query arguments {0}'.format(self.request.arguments))

        # request query arguments
        query_args = self.request.arguments

        # get the current frontend logged username
        username = self.get_current_username()

        # if the user don't provide an account we use the frontend username as last resort
        account = (query_args.get('account', [username])[0] if not account else account)

        # query string checked from string to boolean
        checked = str2bool(str(query_args.get('checked', [False])[0]))

        # cache stuff
        data = None

        if not transaction_uuid:
            # get list of directories
            transactions = yield self.get_transaction_list(account, checked, page_num)
            self.set_status(200)
            self.finish({'transactions':transactions})
        else:
            # try to get stuff from cache first
            logging.info('transaction_uuid {0}'.format(transaction_uuid.rstrip('/')))

            try:
                data = self.cache.get('transactions:{0}'.format(transaction_uuid))
            except Exception, e:
                logging.error(e)
            # when we're done with the cache stuff get the transaction information
            if data is not None:
                logging.info('transactions:{0} done retrieving!'.format(transaction_uuid))
                result = data
            else:
                data = yield self.get_transaction(account, transaction_uuid.rstrip('/'))
                if self.cache.add('transactions:{0}'.format(transaction_uuid), data, 60):
                    logging.info('new cache entry {0}'.format(str(data)))
                    result = data

            if not result:

                # -- need moar info

                self.set_status(400)
                self.finish({'missing account {0} transaction_uuid {1} page_num {2} checked {3}'.format(
                    account, transaction_uuid.rstrip('/'), page_num, checked):result})
            else:
                self.set_status(200)
                self.finish(result)

    @gen.coroutine
    def patch(self, transaction_uuid):
        '''
            Modify transaction
        '''
        logging.info('request.arguments {0}'.format(self.request.arguments))
        logging.info('request.body {0}'.format(self.request.body))

        struct = yield check_json(self.request.body)

        logging.info('patch received struct {0}'.format(struct))

        format_pass = (True if not dict(struct).get('errors', False) else False)
        if not format_pass:
            self.set_status(400)
            self.finish({'JSON':format_pass})
            return

        account = self.request.arguments.get('account', [None])[0]

        logging.info('account {0} uuid {1} struct {2}'.format(account, transaction_uuid, struct))

        result = yield self.modify_transaction(account, transaction_uuid, struct)

        if not result:
            self.set_status(400)
            system_error = errors.Error('missing')
            error = system_error.missing('transaction', transaction_uuid)
            self.finish(error)
            return

        self.set_status(200)
        self.finish({'message': 'update completed successfully'})


@content_type_validation
class SearchTransactionsHandler(cuallix.Cuallix, BaseHandler):
    '''
        HTTP request handlers

        Cuallix SearchTransactions
    '''

    @gen.coroutine
    def post(self):
        '''
            Cuallix Search Transactions
        '''
        # post structure
        struct = yield check_json(self.request.body)

        # format pass ().
        format_pass = (True if struct else False)
        if not format_pass:
            self.set_status(400)
            self.finish({'JSON':format_pass})
            return

        # logging new structure
        logging.info('cuallix search transactions structure {0}'.format(str(struct)))

        # logging request query arguments
        logging.info('logging request query arguments... {0}'.format(
            str(self.request.arguments))
        )

        # request query arguments
        query_args = self.request.arguments

        # get account from new struct
        account = struct.get('account', None)

        # execute the method function stuff
        search_transactions = yield self.search_transactions(struct)

        # TODO: a little work on error stuff on cuallix API services.
        
        if 'error' in search_transactions:
            scheme = 'payment'
            reason = {'duplicates': [
                (scheme, 'account'),
                (scheme, 'phone_number')
            ]}
            message = yield self.let_it_crash(struct, scheme, search_transactions, reason)

            logging.warning(message)
            self.set_status(400)
            self.finish(message)
            return

        self.set_status(201)
        self.finish(search_transactions)


@content_type_validation
class RangeTransactionsHandler(cuallix.Cuallix, BaseHandler):
    '''
        HTTP request handlers

        Cuallix RangeDateTransactions
    '''

    @gen.coroutine
    def post(self):
        '''
            Cuallix Search Transactions
        '''
        # post structure
        struct = yield check_json(self.request.body)

        # format pass ().
        format_pass = (True if struct else False)
        if not format_pass:
            self.set_status(400)
            self.finish({'JSON':format_pass})
            return

        # logging new structure
        logging.info('cuallix range date transactions structure {0}'.format(str(struct)))

        # logging request query arguments
        logging.info('logging request query arguments... {0}'.format(
            str(self.request.arguments))
        )

        # request query arguments
        query_args = self.request.arguments

        # get account from new struct
        account = struct.get('account', None)

        # execute the method function stuff
        range_transactions = yield self.date_range_search_transactions(struct)

        # TODO: a little work on error stuff on cuallix API services.
        
        if 'error' in range_transactions:
            scheme = 'payment'
            reason = {'duplicates': [
                (scheme, 'account'),
                (scheme, 'phone_number')
            ]}
            message = yield self.let_it_crash(struct, scheme, range_transactions, reason)

            logging.warning(message)
            self.set_status(400)
            self.finish(message)
            return

        self.set_status(201)
        self.finish(range_transactions)


@content_type_validation
class LoadFundsHandler(cuallix.Cuallix, BaseHandler):
    '''
        HTTP request handlers

        Cuallix LoadFunds
    '''

    @gen.coroutine
    def post(self):
        '''
            Load Funds
        '''
        # post structure
        struct = yield check_json(self.request.body)

        # format pass ().
        format_pass = (True if struct else False)
        if not format_pass:
            self.set_status(400)
            self.finish({'JSON':format_pass})
            return

        # logging new structure
        logging.info('cuallix load funds structure {0}'.format(str(struct)))

        # logging request query arguments
        logging.info('logging request query arguments... {0}'.format(
            str(self.request.arguments))
        )

        # request query arguments
        query_args = self.request.arguments

        # get account from new struct
        account = struct.get('account', None)

        # get the current frontend logged username
        username = self.get_current_username()

        # if the user don't provide an account we use the frontend username as last resort
        account = (query_args.get('account', [username])[0] if not account else account)

        # execute the method function stuff
        load_funds = yield self.load_funds(struct)

        # TODO: a little work on error stuff on cuallix API services.
        
        if 'error' in load_funds:
            scheme = 'payment'
            reason = {'duplicates': [
                (scheme, 'account'),
                (scheme, 'phone_number')
            ]}
            message = yield self.let_it_crash(struct, scheme, load_funds, reason)

            logging.warning(message)
            self.set_status(400)
            self.finish(message)
            return

        self.set_status(201)
        self.finish(load_funds)


@content_type_validation
class SearchCustomerHandler(cuallix.Cuallix, BaseHandler):
    '''
        HTTP request handlers

        Cuallix SearchCustomer
    '''

    @gen.coroutine
    def post(self):
        '''
            Search Customer
        '''
        # post structure
        struct = yield check_json(self.request.body)

        # format pass ().
        format_pass = (True if struct else False)
        if not format_pass:
            self.set_status(400)
            self.finish({'JSON':format_pass})
            return

        # logging new structure
        logging.info('cuallix search customer structure {0}'.format(str(struct)))

        # logging request query arguments
        logging.info('logging request query arguments... {0}'.format(
            str(self.request.arguments))
        )

        # request query arguments
        query_args = self.request.arguments

        # get account from new struct
        account = struct.get('account', None)

        # execute user register function
        get_token = yield self.search_customer(struct)

        # TODO: more work on error stuff on cuallix API services.
        if 'error' in get_token:
            scheme = 'contact' # ???
            reason = {'duplicates': [
                (scheme, 'account'),
                (scheme, 'phone_number')
            ]}
            message = yield self.let_it_crash(struct, scheme, get_token, reason)

            logging.warning(message)
            self.set_status(400)
            self.finish(message)
            return

        self.set_status(201)
        self.finish(get_token)


@content_type_validation
class RequestPaymentURLHandler(cuallix.Cuallix, BaseHandler):
    '''
        HTTP request handlers

        Cuallix RequestURL
    '''

    @gen.coroutine
    def post(self):
        '''
            Request URL
        '''
        # post structure
        struct = yield check_json(self.request.body)

        # format pass ().
        format_pass = (True if struct else False)
        if not format_pass:
            self.set_status(400)
            self.finish({'JSON':format_pass})
            return

        # logging new structure
        logging.info('cuallix request url structure {0}'.format(str(struct)))

        # logging request query arguments
        logging.info('logging request query arguments... {0}'.format(
            str(self.request.arguments))
        )

        # request query arguments
        query_args = self.request.arguments

        # get account from new struct
        account = struct.get('account', None)

        # get the current frontend logged username
        username = self.get_current_username()

        # if the user don't provide an account we use the frontend username as last resort
        account = (query_args.get('account', [username])[0] if not account else account)

        # execute get_payment_url function
        request_url = yield self.get_payment_url(struct)

        # TODO: more work on error stuff on cuallix API services.
        if 'error' in request_url:
            scheme = 'contact' # ???
            reason = {'duplicates': [
                (scheme, 'account'),
                (scheme, 'phone_number')
            ]}
            message = yield self.let_it_crash(struct, scheme, request_url, reason)

            logging.warning(message)
            self.set_status(400)
            self.finish(message)
            return

        self.set_status(201)
        self.finish(request_url)


#@content_type_validation
class SendMoneyHandler(cuallix.Cuallix, BaseHandler):
    '''
        HTTP request handlers

        Cuallix SendMoney
    '''

    @gen.coroutine
    def get(self):
        '''
            Get stuff from cuallix before send money
        '''
         # logging request query arguments
        logging.info('request query arguments {0}'.format(self.request.arguments))

        # request query arguments
        query_args = self.request.arguments

        # get the current frontend logged username
        username = self.get_current_username()

        # if the user don't provide an account we use the frontend username as last resort
        #account = (query_args.get('account', [username])[0] if not account else None)

        #logging.info(account)

        # write temporal stuff in a db then when jose click on confirm re-load the stuff.

        system_id = ['2229']

        struct = {
            'uuid': str(uuid.uuid4()),
            'user_id': query_args.get('user', system_id)[0],
            'transaction': query_args.get('transaction')[0],
            'authorization': query_args.get('authorization', None)[0],
            'culture': 'en-US',
            'application_id': 26,
            'system_id': system_id[0],
            'checked': False
        }

        # search customer to renew the token

        # to renew the stuff we need a phone_numer and country code.

        # execute get_payment_url function
        new_transaction = yield self.new_transaction(struct)

        # then send money

        #self.finish({'args':new_transaction})

        self.redirect('http://demo.techgcs.com#send')


    @gen.coroutine
    def post(self):
        '''
            Send Money
        '''
        # post structure
        struct = yield check_json(self.request.body)

        # format pass ().
        format_pass = (True if struct else False)
        if not format_pass:
            self.set_status(400)
            self.finish({'JSON':format_pass})
            return

        # logging new structure
        logging.info('cuallix send money structure {0}'.format(str(struct)))

        # logging request query arguments
        logging.info('logging request query arguments... {0}'.format(
            str(self.request.arguments))
        )

        # request query arguments
        query_args = self.request.arguments

        # get account from new struct
        account = struct.get('account', None)

        # get the current frontend logged username
        username = self.get_current_username()

        # if the user don't provide an account we use the frontend username as last resort
        account = (query_args.get('account', [username])[0] if not account else account)

        # execute get_payment_url function
        send_money = yield self.send_money(struct)

        # TODO: more work on error stuff on cuallix API services.
        if 'error' in send_money:
            scheme = 'contact' # ???
            reason = {'duplicates': [
                (scheme, 'account'),
                (scheme, 'phone_number')
            ]}
            message = yield self.let_it_crash(struct, scheme, send_money, reason)

            logging.warning(message)
            self.set_status(400)
            self.finish(message)
            return

        self.set_status(201)
        self.finish(send_money)
