# -*- coding: utf-8 -*-
'''
    Payments message models.
'''

# This file is part of howler.

# Distributed under the terms of the last AGPL License.
# The full license is in the file LICENCE, distributed as part of this software.

__author__ = 'Jean Chassoul'


import arrow
import uuid

from schematics import models
from schematics import types
from schematics.types import compound

#"start up != avoid shut down"

__None_Id__ = 00000 


class Status(models.Model):
    '''
        Cuallix Status
    '''
    Code = types.StringType()
    Message = types.StringType()


class Transaction(models.Model):
    '''
        Cuallix Transaction
    '''
    TransactionNum = types.StringType(default=str(__None_Id__))
    Summary = types.StringType()
    Amount = types.StringType()
    Fee = types.StringType()
    Total = types.StringType()


class SettleTransaction(models.Model):
    '''
        Settle Transaction
    '''
    Culture = types.StringType()
    ApplicationId = types.StringType()
    UserId = types.StringType()
    CustomerToken = types.StringType()
    TransactionNum = types.StringType()


class TransactionStatus(models.Model):
    '''
        Cuallix Transaction Status
    '''
    Culture = types.StringType()
    ApplicationId = types.StringType()
    UserId = types.StringType()
    CustomerToken = types.StringType()
    TransactionNum = types.StringType()


class SearchTransactions(models.Model):
    '''
        Cuallix Search Transactions
    '''
    Culture = types.StringType()
    ApplicationId = types.StringType()
    UserId = types.StringType()
    TransactionNum = types.StringType()


class Payment(models.Model):
    '''
        Payment structure
    '''
    uuid = types.UUIDType(default=uuid.uuid4)

    account = types.StringType(required=True)
    credit_card_type = types.StringType(required=False)

    merchant = types.StringType()

    address = types.StringType()

    phone = types.StringType()

    email = types.EmailType()
    
    card_name = types.StringType()

    amount_funds = types.StringType() 
    
    credit_card_number = types.StringType()
    credit_card_cvc = types.StringType()

    exp_month = types.StringType()
    exp_year = types.StringType()

    CustomerToken = types.StringType(default='None')

    Status = compound.ModelType(Status)
    Transaction = compound.ModelType(Transaction)
    AuthorizationNum = types.IntType(default=__None_Id__)

    created = types.DateTimeType(default=arrow.utcnow().naive)


class BaseResult(models.Model):
    '''
        base result
    '''
    results = compound.ListType(compound.ModelType(Payment))