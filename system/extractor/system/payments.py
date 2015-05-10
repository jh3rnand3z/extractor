# -*- coding: utf-8 -*-
'''
    Payments system logic.
'''

# This file is part of howler.

# Distributed under the terms of the last AGPL License.
# The full license is in the file LICENCE, distributed as part of this software.

__author__ = 'Jean Chassoul'


import arrow
import motor
import uuid

import logging

from tornado import gen

from howler.messages import payments

from howler.tools import clean_structure, clean_results


class Payments(object):
    '''
        Payments stuffs
    '''

    @gen.coroutine
    def get_payment(self, account, payment_uuid):
        '''
            Get a detail payment
        '''
        if not account:
            payment = yield self.db.payments.find_one({'uuid':payment_uuid})
        else:

            # change accountcode to account, because the accountcode is a uuid
            # and we're expecting an account name.

            payment = yield self.db.payments.find_one({'uuid':payment_uuid,
                                                     'account':account})
        try:
            if payment:
                payment = payments.Payment(payment)
                payment.validate()
        except Exception, e:
            logging.exception(e)
            raise e
        finally:
            raise gen.Return(payment)



    @gen.coroutine
    def get_contactx_list(self, account, checked, page_num):
        '''
            Get contact list
        '''
        page_num = int(page_num)
        page_size = self.settings.get('page_size')
        contact_list = []

        # remove phone_2, phone_3 and contact_requests from query stuff and db.
        query = self.db.contacts.find(
            {
                'account':account,
                'checked':checked
            },
            {
                '_id':0,
                'phone_2':0,
                'phone_3':0,
                'contact_requests':0
            }
        )

        q = query

        q = q.sort([('_id', -1)]).skip(int(page_num) * page_size).limit(page_size)

        try:
            while (yield q.fetch_next):
                contact = contacts.Contact(q.next_object())
                contact_list.append(clean_structure(contact))
        except Exception, e:
            logging.exception(e)
            raise gen.Return(e)

        finally:
            raise gen.Return(contact_list)


    @gen.coroutine
    def get_payment_list(self, account, start, end, lapse, status, page_num):
        '''
            Get detail payments 
        '''
        page_num = int(page_num)
        page_size = self.settings['page_size']
        logging.info('fucking page_size {0} and page_num {1}'.format(page_size, page_num))

        # payment list
        payment_list = []
        
        if not account:
            query = self.db.payments.find({'public':True})
        elif type(account) is list:
            accounts = [{'accountcode':a, 'assigned': True} for a in account]
            query = self.db.payments.find({'$or':accounts})
        else:
            query = self.db.payments.find({'merchand_id':account,
                                        'assigned':True})


        # this is the real query
        query = self.db.payments.find({},{'_id':0,})        
        
        query = query.sort([('uuid', -1)]).skip(page_num * page_size).limit(page_size)
        
        try:
            
            while (yield query.fetch_next):
                result = query.next_object()
                payment_list.append(payments.Payment(result))

        except Exception, e:
            logging.exception(e)
            raise e

        logging.info('length of the real query: {0}'.format(len(payment_list)))

        try:
            struct = {'results': payment_list}
            message = payments.BaseResult(struct)
            message.validate()
            message = clean_results(message)
        except Exception, e:
            logging.exception(e)
            raise e
        finally:
            raise gen.Return(message)

    @gen.coroutine
    def new_payment(self, struct):
        '''
            New payment
        '''
        try:
            payment = payments.Payment(struct)
            payment.validate()
            payment = clean_structure(payment)
        except Exception, e:
            logging.error(e)
            raise e

        try:
            result = yield self.db.payments.insert(payment)
            message = payment.get('uuid')
        except Exception, e:
            logging.error(e)
            message = str(e)

        raise gen.Return(message)