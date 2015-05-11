# -*- coding: utf-8 -*-
'''
    Extractor cuallix system logic.
'''

# This file is part of extractor.

# Distributed under the terms of the last AGPL License.
# The full license is in the file LICENCE, distributed as part of this software.

__author__ = 'Jean Chassoul'


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

    @gen.coroutine
    def user_register(self, struct):
        '''
            User register on the CLX API
        '''
        uri = 'http://201.149.49.181:9027/CLXAPI/UserServices/User/Register'
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
        uri = 'http://201.149.49.181:9027/CLXAPI/Services/Customer/Register'
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
        uri = 'http://201.149.49.181:9027/CLXAPI/Services/Customer/Search'
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
        uri = 'http://201.149.49.181:9027/CLXAPI/Services/CrossBranded/RequestUrl'
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
        uri = 'http://201.149.49.181:9027/CLXAPI/CustomerServices/MoneyTransfer/SendMoney'
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
        uri = 'http://201.149.49.181:9027/CLXAPI/UserServices/Account/Assign'
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
        uri = 'http://201.149.49.181:9027/CLXAPI/UserServices/Account/LoadFunds'
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
        uri = 'http://201.149.49.181:9027/CLXAPI/Services/Transactions/Settle'
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
        uri = 'http://201.149.49.181:9027/CLXAPI/CustomerServices/Transactions/Status'
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
        uri = 'http://201.149.49.181:9027/CLXAPI/UserServices/Transactions/Search'
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