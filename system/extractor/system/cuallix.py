# -*- coding: utf-8 -*-
'''
    Extractor cuallix system logic.
'''

# This file is part of extractor.

# Distributed under the terms of the last AGPL License.
# The full license is in the file LICENCE, distributed as part of this software.

__author__ = 'Jean Chassoul'


'''

    When writing these for my own daemons I usually make an "undead mode"
    where a monitor daemon is created to watch the service daemon, and 
    the service daemon itself acts as the monitor for the monitor daemon.


    Some (most?) watchdog/supervisor type systems start two processes 
    that watch each other in addition to the target process(es).

'''


import arrow
import motor
import uuid

import ujson as json

import requests

import logging

from tornado import gen

from extractor.messages import cuallix
from extractor.messages import payments

from extractor.tools import clean_structure, clean_results


class Cuallix(object):
    '''
        Cuallix system logic
    '''
    __environment = 'production'
    __cuallix_production = 'http://201.149.49.175:9027'
    __cuallix_development = 'http://201.149.49.181:9027'
        
    def __init__(self):
        self.production_env_url = self.__cuallix_production
        self.development_env_url = self.__cuallix_development

        self.environment = self.__environment

        if self.environment == 'production':
            self.url = self.production_env_url
        else:
            self.url = self.development_env_url

    @gen.coroutine
    def get_transaction_list(self, account, checked, page_num):
        '''
            Get contact list
        '''
        page_num = int(page_num)
        page_size = self.settings.get('page_size')
        transaction_list = []

        query = self.db.transactions.find(
            {
                #'account':account,
                'checked':checked
            },
            {
                '_id':0,
            }
        )

        q = query

        q = q.sort([('_id', -1)]).skip(int(page_num) * page_size).limit(page_size)

        try:
            while (yield q.fetch_next):
                transaction = cuallix.Transaction(q.next_object())
                transaction_list.append(clean_structure(transaction))
        except Exception, e:
            logging.exception(e)
            raise gen.Return(e)

        finally:
            raise gen.Return(transaction_list)

    @gen.coroutine
    def get_transaction(self, account, transaction_uuid):
        '''
            Get transaction
        '''
        message = None
        logging.info('{0} get transaction {1}'.format(account, transaction_uuid))
        try:
            result = yield self.db.transactions.find_one(
                {'uuid': transaction_uuid},
                {'_id':0} # remove this stuff from db.
            )

            logging.info('{0} this is the result'.format(str(result)))
            if result:
                transaction = cuallix.Transaction(result)
                transaction.validate()
                message = clean_structure(transaction)
        except Exception, e:
            logging.exception(e)
            raise e
        finally:
            raise gen.Return(result)

    @gen.coroutine
    def user_register(self, struct):
        '''
            User register on the CLX API
        '''
        uri = '{0}/CLXAPI/UserServices/User/Register'.format(self.url)
        try:
            register = cuallix.Register(struct)
            register.validate()
            register = clean_structure(register)
        except Exception, e:
            logging.error(e)
            raise e

        headers = {
            'Content-type': 'application/json',
            'Accept': 'text/plain',
            'Authorization': 'CLXTKN /r+1NILWP7jwHK1sDsy35P5dE77sdae6ZSoK4v6FVz8='
        }

        logging.info(register)

        r = requests.post(uri, data=json.dumps(register), headers=headers)

        logging.warning(r.content)

        raise gen.Return(r.content)

    @gen.coroutine
    def customer_register(self, struct):
        '''
            Register customer on the CLX API
        '''
        uri = '{0}/CLXAPI/Services/Customer/Register'.format(self.url)
        try:
            register = cuallix.RegisterCustomer(struct)
            register.validate()
            register = clean_structure(register)
        except Exception, e:
            logging.error(e)
            raise e

        headers = {
            'Content-type': 'application/json',
            'Accept': 'text/plain',
            'Authorization': 'CLXTKN /r+1NILWP7jwHK1sDsy35P5dE77sdae6ZSoK4v6FVz8='
        }

        logging.info(register)

        r = requests.post(uri, data=json.dumps(register), headers=headers)

        logging.warning(r.content)

        raise gen.Return(r.content)

    @gen.coroutine
    def search_customer(self, struct):
        '''
            Search customer on the CLX API
        '''
        uri = '{0}/CLXAPI/Services/Customer/Search'.format(self.url);
        try:
            customer = cuallix.SearchCustomer(struct)
            customer.validate()
            customer = clean_structure(customer)
        except Exception, e:
            logging.error(e)
            raise e

        headers = {
            'Content-type': 'application/json',
            'Accept': 'text/plain',
            'Authorization': 'CLXTKN /r+1NILWP7jwHK1sDsy35P5dE77sdae6ZSoK4v6FVz8='
        }

        logging.info(customer)

        r = requests.post(uri, data=json.dumps(customer), headers=headers)

        logging.warning(r.content)

        raise gen.Return(r.content)

    @gen.coroutine
    def get_payment_url(self, struct):
        '''
            Request payment URL on the CLX API
        '''
        uri = '{0}/CLXAPI/Services/CrossBranded/RequestUrl'.format(self.url)
        try:
            payment_url = cuallix.PaymentUrl(struct)
            payment_url.validate()
            payment_url = clean_structure(payment_url)
        except Exception, e:
            logging.error(e)
            raise e

        headers = {
            'Content-type': 'application/json',
            'Accept': 'text/plain',
            'Authorization': 'CLXTKN /r+1NILWP7jwHK1sDsy35P5dE77sdae6ZSoK4v6FVz8='
        }

        logging.info(payment_url)

        r = requests.post(uri, data=json.dumps(payment_url), headers=headers)

        logging.warning(r.content)

        raise gen.Return(r.content)

    @gen.coroutine
    def send_money(self, struct):
        '''
            Send Money on the CLX API
        '''
        uri = '{0}/CLXAPI/CustomerServices/MoneyTransfer/SendMoney'.format(self.url)
        try:
            send_money = cuallix.SendMoney(struct)
            send_money.validate()
            send_money = clean_structure(send_money)
        except Exception, e:
            logging.error(e)
            raise e

        headers = {
            'Content-type': 'application/json',
            'Accept': 'text/plain',
            'Authorization': 'CLXTKN /r+1NILWP7jwHK1sDsy35P5dE77sdae6ZSoK4v6FVz8='
        }

        logging.info(send_money)

        r = requests.post(uri, data=json.dumps(send_money), headers=headers)

        logging.warning(r.content)

        raise gen.Return(r.content)

    @gen.coroutine
    def assign_account(self, struct):
        '''
            User assign account
        '''
        uri = '{0}/CLXAPI/UserServices/Account/Assign'.format(self.url)
        try:
            assign = cuallix.Assign(struct)
            assign.validate()
            assign = clean_structure(assign)
        except Exception, e:
            logging.error(e)
            raise e

        headers = {
            'Content-type': 'application/json',
            'Accept': 'text/plain',
            'Authorization': 'CLXTKN /r+1NILWP7jwHK1sDsy35P5dE77sdae6ZSoK4v6FVz8='
        }

        logging.info(assign)

        r = requests.post(uri, data=json.dumps(assign), headers=headers)

        logging.warning(r.content)

        raise gen.Return(r.content)

    @gen.coroutine
    def load_funds(self, struct):
        '''
            Account load funds
        '''
        uri = '{0}/CLXAPI/UserServices/Account/LoadFunds'.format(self.url)
        try:
            funds = cuallix.LoadFunds(struct)
            funds.validate()
            funds = clean_structure(funds)
        except Exception, e:
            logging.error(e)
            raise e

        headers = {
            'Content-type': 'application/json',
            'Accept': 'text/plain',
            'Authorization': 'CLXTKN /r+1NILWP7jwHK1sDsy35P5dE77sdae6ZSoK4v6FVz8='
        }

        logging.info(funds)

        r = requests.post(uri, data=json.dumps(funds), headers=headers)

        logging.warning(r.content)

        raise gen.Return(r.content)

    @gen.coroutine
    def settle_transaction(self, struct):
        '''
            Settle transaction
        '''
        uri = '{0}/CLXAPI/Services/Transactions/Settle'.format(self.url)
        try:
            settle = payments.SettleTransaction(struct)
            settle.validate()
            settle = clean_structure(settle)
        except Exception, e:
            logging.error(e)
            raise e

        headers = {
            'Content-type': 'application/json',
            'Accept': 'text/plain',
            'Authorization': 'CLXTKN /r+1NILWP7jwHK1sDsy35P5dE77sdae6ZSoK4v6FVz8='
        }

        logging.info(settle)

        r = requests.post(uri, data=json.dumps(settle), headers=headers)

        logging.warning(r.content)

        raise gen.Return(r.content)

    @gen.coroutine
    def status_transaction(self, struct):
        '''
            Status transaction
        '''
        uri = '{0}/CLXAPI/CustomerServices/Transactions/Status'.format(self.url)
        try:
            status = payments.TransactionStatus(struct)
            status.validate()
            status = clean_structure(status)
        except Exception, e:
            logging.error(e)
            raise e

        headers = {
            'Content-type': 'application/json',
            'Accept': 'text/plain',
            'Authorization': 'CLXTKN /r+1NILWP7jwHK1sDsy35P5dE77sdae6ZSoK4v6FVz8='
        }

        logging.info(status)

        r = requests.post(uri, data=json.dumps(status), headers=headers)

        logging.warning(r.content)

        raise gen.Return(r.content)

    @gen.coroutine
    def search_transactions(self, struct):
        '''
            Search Transactions
        '''
        uri = '{0}/CLXAPI/UserServices/Transactions/Search'.format(self.url)
        try:
            result = payments.SearchTransactions(struct)
            result.validate()
            result = clean_structure(result)
        except Exception, e:
            logging.error(e)
            raise e

        headers = {
            'Content-type': 'application/json',
            'Accept': 'text/plain',
            'Authorization': 'CLXTKN /r+1NILWP7jwHK1sDsy35P5dE77sdae6ZSoK4v6FVz8='
        }

        logging.info(result)

        r = requests.post(uri, data=json.dumps(result), headers=headers)

        logging.warning(r.content)

        raise gen.Return(r.content)

    @gen.coroutine
    def date_range_search_transactions(self, struct):
        '''
            DateRange search transactions
        '''
        uri = '{0}/CLXAPI/UserServices/Transactions/DateRange'.format(self.url)
        try:
            result = payments.DateRange(struct)
            result.validate()
            result = clean_structure(result)
        except Exception, e:
            logging.error(e)
            raise e

        headers = {
            'Content-type': 'application/json',
            'Accept': 'text/plain',
            'Authorization': 'CLXTKN /r+1NILWP7jwHK1sDsy35P5dE77sdae6ZSoK4v6FVz8='
        }

        logging.info(result)

        r = requests.post(uri, data=json.dumps(result), headers=headers)

        logging.warning(r.content)

        raise gen.Return(r.content)

    @gen.coroutine
    def new_transaction(self, struct):
        '''
            Store new transaction before validate
        '''
        try:
            result = yield self.db.transactions.insert(struct)
        except Exception, e:
            logging.error(e)
            raise e

        raise gen.Return(struct.get('uuid'))

    @gen.coroutine
    def modify_transaction(self, account, transaction_uuid, struct):
        '''
            Modify transaction
        '''
        try:
            transaction = cuallix.Transaction(struct)
            transaction.validate()
            transaction = clean_structure(transaction)
        except Exception, e:
            logging.error(e)
            raise e

        logging.info('after the stuff after the stuff after the stuff after the stuff ')

        transaction_num = int(transaction_uuid) - 1

        logging.info('transaction_uuid: {0} transaction_num: {1}'.format(transaction_uuid, transaction_num))

        try:
            # missing account !!
            result = yield self.db.transactions.update(
                {'transaction':str(transaction_num)},
                {'$set':transaction}
            )
            logging.info(result)            
        except Exception, e:
            logging.error(e)
            message = str(e)

        raise gen.Return(bool(result.get('n')))