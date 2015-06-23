# -*- coding: utf-8 -*-
'''
    Extractor companies system logic functions.
'''

# This file is part of extractor.

# Distributed under the terms of the last AGPL License.
# The full license is in the file LICENCE, distributed as part of this software.

__author__ = 'Jean Chassoul'


import logging

import arrow
import motor

import uuid

# import numpy as np
# import pandas as pd

from tornado import gen

from extractor.messages import companies

from extractor.tools import clean_structure
from extractor.tools import clean_results


class Companies(object):
    '''
        companies resources
    '''

    @gen.coroutine
    def get_company(self, account, company_uuid):
        '''
            Get a detail company
        '''
        message = None
        if not account:
            company = yield self.db.companies.find_one({'uuid':company_uuid},{'_id':0})
        else:

            # change accountcode to account, because the accountcode is a uuid
            # and we're expecting an account name.

            company = yield self.db.companies.find_one({'uuid':company_uuid,
                                                     'account':account},
                                                    {'_id':0})
        try:
            if company:
                company = companies.Company(company)
                company.validate()
                message = clean_results(company)
        except Exception, e:
            logging.error(e) # catch some daemon here!
            message = str(e) # clean this or something...
            raise e
        finally:
            raise gen.Return(message)

    @gen.coroutine
    def get_company_list(self, account, start, end, lapse, page_num):
        '''
            Get detail companies 
        '''
        page_num = int(page_num)
        page_size = self.settings['page_size']
        company_list = []
        
        if not account:
            logging.error('not account get public list');
            
            # {'public':False}
            query = self.db.companies.find({}, {'_id':0})

        elif type(account) is list:
            logging.error('list of accounts get compound list');
            
            accounts = [{'accountcode':a, 'assigned': True} for a in account]
            query = self.db.companies.find({'$or':accounts})
        else:
            logging.error('account {0} getting list of companies'.format(account));
            
            query = self.db.companies.find({}, {'_id':0})

            #query = self.db.companies.find({
            #    'account':account,
            #    'assigned':True
            #})

        
        query = query.sort([('uuid', -1)]).skip(page_num * page_size).limit(page_size)
        
        try:
            
            while (yield query.fetch_next):
                result = query.next_object()
                company_list.append(companies.Company(result))

        except Exception, e:
            logging.exception(e)
            raise e

        try:
            struct = {'results': company_list}
            message = companies.BaseResult(struct)
            message.validate()
            message = clean_results(message)
        except Exception, e:
            logging.exception(e)
            raise e
        finally:
            raise gen.Return(message)
    
    @gen.coroutine
    def get_unassigned_companies(self, start, end, lapse, page_num):
        '''
            Get unassigned company detail companies
        '''
        page_num = int(page_num)
        page_size = self.settings['page_size']
        result = []
        
        # or $exist = false ?

        query = self.db.companies.find({'assigned':False})
        query = query.sort([('uuid', -1)]).skip(page_num * page_size).limit(page_size)
        
        try:
            for company in (yield query.to_list()):
                result.append(companies.Company(company))
            
            struct = {'results':result}

            results = reports.BaseResult(struct)
            results.validate()
        except Exception, e:
            logging.exception(e)
            raise e

        results = clean_results(results)        
        raise gen.Return(results)

    @gen.coroutine
    def new_company(self, struct):
        '''
            Create a new company entry
        '''
        try:
            company = companies.Company(struct)
            company.validate()
        except Exception, e:
            logging.exception(e)
            raise e

        company = clean_structure(company)

        result = yield self.db.companies.insert(company)

        raise gen.Return(company.get('uuid'))

    @gen.coroutine
    def set_assigned_flag(self, account, company_uuid):
        '''
            Set the company assigned flag
        '''
        logging.info('set_assigned_flag account: %s, company: %s' % (account, company_uuid))

        result = yield self.db.companies.update(
                                {'uuid':company_uuid, 
                                 'accountcode':account}, 
                                {'$set': {'assigned': True}})
        
        raise gen.Return(result)

    @gen.coroutine
    def remove_company(self, company_uuid):
        '''
            Remove a company entry
        '''
        result = yield self.db.companies.remove({'uuid':company_uuid})
        raise gen.Return(result)

    @gen.coroutine
    def replace_company(self, struct):
        '''
            Replace a existent company entry
        '''
        # put implementation
        pass

    @gen.coroutine
    def resource_options(self):
        '''
            Return resource options
        '''
        # options implementation
        pass

    @gen.coroutine
    def modify_company(self, struct):
        '''
            Modify a existent company entry
        '''
        # patch implementation
        pass