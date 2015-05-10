# -*- coding: utf-8 -*-
'''
    HTTP cuallix handlers.
'''

# This file is part of howler.

# Distributed under the terms of the last AGPL License.
# The full license is in the file LICENCE, distributed as part of this software.

__author__ = 'Jean Chassoul'


import ujson as json
import time
import arrow
import motor

import logging

from tornado import gen
from tornado import web

from tornado import httpclient

import urllib

# import system, messages and tool for work on cuallix
from howler.system import cuallix
from howler.messages import cuallix as models
from howler.tools import content_type_validation
from howler.tools import check_json
from howler.tools import errors

from howler.handlers import BaseHandler


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



@content_type_validation
class SendMoneyHandler(cuallix.Cuallix, BaseHandler):
    '''
        HTTP request handlers

        Cuallix SendMoney
    '''

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
