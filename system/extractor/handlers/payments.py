# -*- coding: utf-8 -*-
'''
    HTTP payment handlers.
'''

# This file is part of extractor.

# Distributed under the terms of the last AGPL License.
# The full license is in the file LICENCE, distributed as part of this software.

__author__ = 'Jean Chassoul'


import ujson as json
import motor

from tornado import gen
from tornado import web

import logging

# system payments
from extractor.system import payments

# errors, string to boolean, check JSON, new resource, content type validation.
from extractor.tools import str2bool, check_json, new_resource, content_type_validation
from extractor.tools import errors

# system handler.
from extractor.handlers import BaseHandler


@content_type_validation
class Handler(payments.Payments, BaseHandler):
    '''
        Contacts HTTP request handlers
    '''

    @gen.coroutine
    def get(self, payment_uuid=None, start=None, end=None, page_num=0, lapse='hours', status='all'):
        '''
            Get payments handler
        '''

        # -- logging info

        logging.info(self.request.arguments)

        #account = (self.request.arguments.get('account', [None])[0] if not account else account)

        # query string checked from string to boolean
        #checked = str2bool(str(self.request.arguments.get('checked', [False])[0]))

        if payment_uuid:
            payment_uuid = payment_uuid.rstrip('/')

            if self.current_user:
                user = self.current_user
                payment = yield self.get_payment(user, payment_uuid)
            else:
                payment = yield self.get_payment(None, payment_uuid)

            if not payment:
                self.set_status(400)
                system_error = errors.Error('missing')
                error = system_error.missing('payment', payment_uuid)
                self.finish(error)
                return

            self.finish(payment)
            return

        logging.info('Get payments function arguments {0} {1} lapse {2} status {3}'.format(start, end, lapse, status))

        if self.current_user:
            user = self.current_user
            orgs = yield self.get_orgs_list(user)
            
            account_list = (orgs['orgs'] if orgs else False)
            if not account_list:
                result = yield self.get_payment_list(
                                        account=user, 
                                        lapse=lapse,
                                        status=status,
                                        start=start,
                                        end=end,
                                        page_num=page_num)
            else:
                account_list.append(user)
                result = yield self.get_payment_list(
                                        account=account_list,
                                        lapse=lapse,
                                        status=status,
                                        start=start,
                                        end=end,
                                        page_num=page_num)
        else:
            result = yield self.get_payment_list(
                                    account=None,
                                    lapse=lapse,
                                    status=status,
                                    start=start,
                                    end=end,
                                    page_num=page_num)

        logging.info(result)

        self.finish(result)

    @gen.coroutine
    def post(self):
        '''
            New payment
        '''
        # post structure
        struct = yield check_json(self.request.body)

        # format pass ().
        format_pass = (True if struct else False)
        if not format_pass:
            self.set_status(400)
            self.finish({'JSON':format_pass})
            return

        # settings database
        db = self.settings.get('db')

        # logging new contact structure
        logging.info('new payment structure {0}'.format(str(struct)))

        # logging request query arguments
        logging.info(self.request.arguments)

        # request query arguments
        query_args = self.request.arguments

        # get account from new contact struct
        account = struct.get('account', None)

        # get the current frontend logged username
        username = self.get_current_username()

        # if the user don't provide an account we use the frontend username as last resort
        account = (query_args.get('account', [username])[0] if not account else account)

        # we use the front-end username as last resort
        if not struct.get('account'):
            struct['account'] = account

        new_payment = yield self.new_payment(struct)

        # TODO: a little work on error stuff on cuallix API services.

        if 'error' in new_payment:
            scheme = 'payment'
            reason = {'duplicates': [
                (scheme, 'account'),
                (scheme, 'phone_number')
            ]}
            message = yield self.let_it_crash(struct, scheme, new_payment, reason)

            logging.warning(message)
            self.set_status(400)
            self.finish(message)
            return

        self.set_status(201)
        self.finish({'uuid':new_payment})