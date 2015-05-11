# -*- coding: utf-8 -*-
'''
    Extractor system logic.
'''

# This file is part of extractor.

# Distributed under the terms of the last AGPL License.
# The full license is in the file LICENCE, distributed as part of this software.

__author__ = 'Jean Chassoul'


# TODO: clean CallFile class it's more old than stuff.

import os
import re
import tempfile


class CallException(Exception):
    '''
        Call Exception
    '''
    pass


class CallError(CallException):
    '''
        Call Error
    '''
    pass


class CallFile(object):
    '''
        Asterisk Call File Generator.
    '''

    def __init__(self):
        self.params = {}
        self._file_options()

    def _file_options(self):
        fileargs = ('Account',
                    'Channel', 'Callerid', 'MaxRetries', 'RetryTime',
                    'WaitTime', 'Context', 'Extension', 'Priority',
                    'Setvar', 'Setvar', 'Setvar', 'Setvar', 'Setvar')

        for i in range(0, len(fileargs)):
            self.params[i] = fileargs[i]

    def input_args(self, path, args):
        if not re.search(r'^/(\w+\W?\w+)+/$', path):
            raise CallError('Invalid path: %s' % path)

        if len(args) != len(self.params):
            raise CallError('INPUT args %s NOT EQUAL file_options %s' % (len(args), len(self.params)))

    def generate_call(self, path, *args):
        self.input_args(path, args)

        (fd, path) = tempfile.mkstemp(suffix = '.call', dir = path)

        file = os.fdopen(fd, 'w')
        for i in range(0, len(args)):
            if i == 0:
                file.write(''.join((self.params[i], ': ', str(args[i]))))
            else:
                file.write(''.join(('\n', self.params[i], ': ', str(args[i]))))
        file.close()
        
        return path

if __name__=='__main__':
    testing = CallFile()
    x = testing.generate_call('/home/ooo/',
        'gocella',
        'SIP/gocella_18777786075/18883829578',
        '18777786075',
        '5',
        '300',
        '45',
        'DID_18777786075',
        '18777786075',
        '1',
        'keyword="sdsd|34"'
    )
