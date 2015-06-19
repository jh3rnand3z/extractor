# -*- coding: utf-8 -*-
'''
    Extractor companies models and messages.
'''

# This file is part of extractor.

# Distributed under the terms of the last AGPL License.
# The full license is in the file LICENCE, distributed as part of this software.

__author__ = 'Jean Chassoul'


import arrow
import uuid

from schematics import models
from schematics import types
from schematics.types import compound


class Company(models.Model):
    '''
        Company Object Data Structure
    '''
    uuid = types.UUIDType(default=uuid.uuid4)
    state_province = types.StringType()
    incorporated_state_province = types.StringType()
    fax = types.StringType()
    vat_tax_id_file_number = types.StringType()
    incorporated_number = types.StringType()
    zip_postal = types.StringType()
    dba = types.StringType()
    federal_tax_id = types.StringType()
    incoportated_country = types.StringType()
    telephone = types.StringType()
    city_town = types.StringType()
    country_company = types.StringType()
    subsidiary_reg_num = types.StringType()
    company_name = types.StringType()
    company_email = types.StringType()
    account_type = types.StringType()
    password = types.StringType()
    subsidiary_name = types.StringType()
    email = types.StringType()
    street_address = types.StringType()
    incorporated_address = types.StringType()

    status = types.StringType()

    checked = types.BooleanType(default=False)
    checked_by = types.StringType()

    #details = compound.ModelType(Log)
    #comments = compound.ModelType(Comment)
    
    created = types.DateTimeType(default=arrow.utcnow().naive)
    #created_at = types.DateTimeType()
    last_modified = types.DateTimeType()
    updated_by = types.DateTimeType()
    updated_at = types.DateTimeType()

    uri = types.StringType()