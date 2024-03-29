# -*- coding: utf-8 -*-
'''
    Extractor HTTP companies handlers.
'''

# This file is part of extractor.

# Distributed under the terms of the last AGPL License.
# The full license is in the file LICENCE, distributed as part of this software.

__author__ = 'Jean Chassoul'


import time
import ujson as json
import motor

# import numpy as np
# import pandas as pd

from tornado import gen
from tornado import web

import logging

# extractor system
from extractor.system import companies

from extractor.tools import content_type_validation
from extractor.tools import check_json
from extractor.tools import new_resource

from extractor.tools import errors

# system handlers
from extractor.handlers import BaseHandler


@content_type_validation
class CompaniesHandler(companies.Companies, BaseHandler):
    '''
        User companies HTTP request handlers
    '''

    @gen.coroutine
    def head(self, account=None, page_num=0):
        '''
            Head companies
        '''
        # logging request query arguments
        logging.info('request query arguments {0}'.format(self.request.arguments))

        # request query arguments
        query_args = self.request.arguments

        # get the current frontend logged username
        username = self.get_current_username()

        # if the user don't provide an account we use the frontend username as last resort
        account = (query_args.get('account', [username])[0] if not account else account)

        # cache data
        data = None

        # return message
        message = None
        
        if not company_uuid:
            companies = yield self.get_company_list(account, start, end, lapse, page_num)
            self.finish(companies)
        else:
            # try to get stuff from cache first
            logging.info('getting companies:{0} from cache'.format(company_uuid))

            try:
                data = self.cache.get('companies:{0}'.format(company_uuid))
            except Exception, e:
                logging.exception(e)

            if data is not None:
                logging.info('companies:{0} done retrieving!'.format(company_uuid))
            else:
                #company_uuid = company_uuid.rstrip('/')
                data = yield self.get_company(None, company_uuid)
                try:
                    if self.cache.add('companies:{0}'.format(company_uuid), data, 60):
                        logging.info('new cache entry companies:{0}'.format(company_uuid))
                except Exception, e:
                    logging.exception(e)

            message = (data if data else None)
            
            if not message:
                # -- need more info
                self.set_status(400)
                self.finish({'missing':company_uuid})
            else:
                self.set_status(200)
                self.finish(message)

    ###@web.authenticated
    @gen.coroutine
    def get(self, account=None, company_uuid=None, start=None, end=None, lapse='hours', page_num=0):
        '''
            Get companies handler
        '''
        # logging request query arguments
        logging.info('request query arguments {0}'.format(self.request.arguments))

        # request query arguments
        query_args = self.request.arguments

        # get the current frontend logged username
        username = self.get_current_username()

        # if the user don't provide an account we use the frontend username as last resort
        account = (query_args.get('account', [username])[0] if not account else account)

        # cache data
        data = None

        # return message
        message = None
        
        if not company_uuid:
            companies = yield self.get_company_list(account, start, end, lapse, page_num)
            self.finish(companies)
        else:
            # try to get stuff from cache first
            logging.info('getting companies:{0} from cache'.format(company_uuid))

            try:
                data = self.cache.get('companies:{0}'.format(company_uuid))
            except Exception, e:
                logging.exception(e)

            if data is not None:
                logging.info('companies:{0} done retrieving!'.format(company_uuid))
            else:
                #company_uuid = company_uuid.rstrip('/')
                data = yield self.get_company(None, company_uuid)
                try:
                    if self.cache.add('companies:{0}'.format(company_uuid), data, 60):
                        logging.info('new cache entry companies:{0}'.format(company_uuid))
                except Exception, e:
                    logging.exception(e)

            message = (data if data else None)
            
            if not message:
                # -- need more info
                self.set_status(400)
                self.finish({'missing':company_uuid})
            else:
                self.set_status(200)
                self.finish(message)
                
    @gen.coroutine
    def post(self):
        '''
            Create company
        '''
        struct = yield check_json(self.request.body)
        
        format_pass = (True if struct else False)
        if not format_pass:
            self.set_status(400)
            self.finish({'JSON':format_pass})
            return

        struct['account_type'] = 'user'

        logging.info('new company structure %s' % str(struct))

        result = yield self.new_company(struct)

        if 'error' in result:
            model = 'User'
            reason = {'duplicates': [(model, 'account'), (model, 'email')]}

            message = yield self.let_it_crash(struct, model, result, reason)

            logging.warning(message)

            self.set_status(400)
            self.finish(message)
            return

        self.set_status(201)
        self.finish({'uuid':result})

    @gen.coroutine
    def patch(self, account):
        '''
            Update company
        '''

        logging.info('request.arguments {0}'.format(self.request.arguments))
        logging.info('request.body {0}'.format(self.request.body))

        struct = yield check_json(self.result.body)

        logging.info('patch received struct {0}'.format(struct))

        format_pass = (True if struct else False)
        if not format_pass:
            self.set_status(400)
            self.finish({'JSON':format_pass})
            return

        struct['account_type'] = 'user'

        logging.info('new update on company structure %s' % str(struct))

        result = yield self.modify_company(account, struct)

        if 'error' in result:
            model = 'User'
            reason = {'duplicates': [(model, 'account'), (model, 'email')]}

            message = yield self.let_it_crash(struct, model, result, reason)

            logging.warning(message)

            self.set_status(400)
            self.finish(message)
            return

        self.set_status(201)
        self.finish({'uuid':result})

    ##@web.authenticated
    @gen.coroutine
    def delete(self, account):
        '''
            Delete a user account
        '''
        account = account.rstrip('/')
        result = yield self.remove_company(account)

        logging.info("why result['n'] ? %s" % str(result))

        if not result['n']:
            self.set_status(400)
            system_error = errors.Error('missing')
            error = system_error.missing('user', account)
            self.finish(error)
            return

        self.set_status(204)
        self.finish()
