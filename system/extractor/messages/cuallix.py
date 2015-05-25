# -*- coding: utf-8 -*-
'''
    Extractor cuallix message models.
'''

# This file is part of extractor.

# Distributed under the terms of the last AGPL License.
# The full license is in the file LICENCE, distributed as part of this software.

__author__ = 'Jean Chassoul'


import uuid

from schematics import models
from schematics import types
from schematics.types import compound

from extractor.messages import Resource


class User(models.Model):
    '''
        Cuallix User
    '''
    CellPhone = types.StringType()
    CountryCode = types.StringType()
    Email = types.EmailType()
    LastName = types.StringType()
    Name = types.StringType()
    Password = types.StringType()


class Register(models.Model):
    '''
        Cuallix Register
    '''
    Culture = types.StringType() 
    ApplicationId = types.StringType()
    User = compound.ModelType(User)


class RegisterCustomer(models.Model):
    '''
        Cuallix Register Customer
    '''
    Culture = types.StringType()
    ApplicationId = types.StringType()
    Customer = compound.ModelType(User)


class Assign(models.Model):
    '''
        Cuallix Assign account
    '''
    Culture = types.StringType()
    ApplicationId = types.StringType()
    UserId = types.StringType()


class LoadFunds(models.Model):
    '''
        Cuallix Load Funds
    '''
    Culture = types.StringType()
    ApplicationId = types.StringType()
    UserId = types.StringType()
    Amount = types.StringType()


class CustomerSummary(models.Model):
    '''
        Cuallix Customer Summary
    '''
    CustomerToken = types.StringType() 
    CustomerName = types.StringType()


class SearchCustomer(models.Model):
    '''
        Cuallix Search Customer
    '''
    Culture = types.StringType()
    ApplicationId = types.StringType()
    UserId = types.StringType() 
    CountryCode = types.StringType()
    CellPhone = types.StringType()


class PaymentUrl(models.Model):
    '''
        Cuallix Payment URL
    '''
    Culture = types.StringType()
    ApplicationId = types.StringType()
    UserId = types.StringType()
    Service = types.StringType(default='3')
    SessionDuration = types.StringType(default='5')
    urlOk = types.StringType()
    urlError = types.StringType()
    Extra = types.StringType()
    Image = types.StringType()
    CustomerToken = types.StringType()


class SendMoney(models.Model):
    '''
        Cuallix Send Money
    '''
    Culture = types.StringType()
    ApplicationId = types.StringType()
    UserId = types.StringType()
    CustomerToken = types.StringType()
    RecipientId = types.StringType(default='1')
    RecipientAccountId = types.StringType(default='1')
    Amount = types.StringType()


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


class Transaction(models.Model):
    '''
        Cuallix Transaction
    '''
    culture = types.StringType()
    transaction = types.StringType()
    user_id = types.StringType()
    uuid = types.StringType()
    checked = types.StringType()
    application_id = types.StringType()
    system_id = types.StringType()
    authorization = types.StringType()
    phone = types.StringType() 
    cc_info = types.StringType()
    holder_name = types.StringType()
    email = types.StringType()