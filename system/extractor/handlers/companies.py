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

# Mango system
from extractor.system import companies

from mango.tools import content_type_validation
from mango.tools import check_json
from mango.tools import new_resource

from mango.tools import errors

# system handlers
from mango.handlers import BaseHandler


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

        # account type flag
        account_type = 'user'

        # cache data
        data = None

        # return result message
        result = None

        if not account:
            companies = yield self.get_company_list(account_type, page_num)
            self.finish({'companies':companies})
        else:
            # try to get stuff from cache first
            logging.info('getting companies:{0} from cache'.format(account))

            try:
                data = self.cache.get('companies:{0}'.format(account))
            except Exception, e:
                logging.exception(e)

            if data is not None:
                logging.info('companies:{0} done retrieving!'.format(account))
                result = data
            else:
                data = yield self.get_company(account.rstrip('/'), account_type)
                try:
                    if self.cache.add('companies:{0}'.format(account), data, 60):
                        logging.info('new cache entry {0}'.format(str(data)))
                except Exception, e:
                    logging.exception(e)
            
            result = (data if data else None)

            if not result:

                # -- nead moar info

                self.set_status(400)
                self.finish({'missing':account.rstrip('/')})
            else:
                self.set_status(200)
                self.finish(result)

    ###@web.authenticated
    @gen.coroutine
    def get(self, account=None, page_num=0):
        '''
            Get user companies
        '''
        # logging request query arguments
        logging.info('request query arguments {0}'.format(self.request.arguments))

        # request query arguments
        query_args = self.request.arguments

        # get the current frontend logged username
        username = self.get_current_username()

        # if the user don't provide an account we use the frontend username as last resort
        account = (query_args.get('account', [username])[0] if not account else account)

        # account type flag
        account_type = 'user'

        # cache data
        data = None

        # return result message
        result = None
        
        if not account:
            companies = yield self.get_company_list(account_type, page_num)
            self.finish({'companies':companies})
        else:
            # try to get stuff from cache first
            logging.info('getting companies:{0} from cache'.format(account))

            try:
                data = self.cache.get('companies:{0}'.format(account))
            except Exception, e:
                logging.exception(e)

            if data is not None:
                logging.info('companies:{0} done retrieving!'.format(account))
            else:
                data = yield self.get_company(account.rstrip('/'), account_type)
                try:
                    if self.cache.add('companies:{0}'.format(account), data, 60):
                        logging.info('new cache entry {0}'.format(str(data)))
                except Exception, e:
                    logging.exception(e)

            result = (data if data else None)
            
            #result = yield self.get_company(account.rstrip('/'), account_type)

            if not result:
                # -- need more info
                self.set_status(400)
                self.finish({'missing':account.rstrip('/')})
            else:
                self.set_status(200)
                self.finish(result)
                
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

