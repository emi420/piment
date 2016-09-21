#!/usr/bin/python
# -*- coding: utf-8 -*-

''' 
 IRRecord - API for LIRC IRRecord 

 You may use any Web Server Admin project under the terms
 of the GNU General Public License (GPL) Version 3.

 (c) 2016 Emilio Mariscal (emi420 [at] gmail.com)
 
 
'''

import pexpect
import subprocess, signal
from os import remove, path, kill


class IRRecord(object):

    _TMP_CFG_FILE = 'tmplircd.conf'
    _LIRCD_CFG_FILE = '/etc/lirc/lircd.conf'
    _LAUNCH_CMD = 'irrecord -d /dev/lirc0 '
    launched = False

    def __init__(self):
        self.launched = False

    def stop_lirc_service(self):
        p = pexpect.spawn('/etc/init.d/lirc stop')
        out = p.readline()
        return out

    def start_lirc_service(self):
        p = pexpect.spawn('/etc/init.d/lirc start')
        out = p.readline()
        return out

    def launch(self):
        if self.launched:
            self.process.kill(0)
        if path.isfile(self._TMP_CFG_FILE):
            remove(self._TMP_CFG_FILE)
        cmd = self._LAUNCH_CMD + self._TMP_CFG_FILE
        self.process = pexpect.spawn(cmd)
        self.launched = True
        return ''

    def enter(self):
        self.process.sendline('')
        return ''

    def get_last_config(self):
        if path.isfile(self._TMP_CFG_FILE):
            content = ""
            with open(self._TMP_CFG_FILE) as f:
                for line in f:
                    content = content + line
        else:
            content = "File not found. \n"
        return content

    def save_last_config(self, name):
        result = 'Not saved.'
        with open(self._TMP_CFG_FILE) as f:
            with open(self._LIRCD_CFG_FILE, "a") as f1:
                for line in f:
                    if line.find("name  tmplircd.conf") > -1:
                        line = "  name  " + name + "\n"
                    f1.write(line)
                    result = 'Saved.'

        return result

    def save_config(self, data):
        result = 'Not saved.'
        with open(self._LIRCD_CFG_FILE, "w") as f:
            f.write(data)
            result = 'Saved.'

        return result

    def get_namespace(self):
        content = ""
        p = pexpect.spawn('irrecord --list-namespace | grep KEY')
        while True:
            out = p.readline()
            if out == '' and p.eof() is not None:
                break
            if out:
                content = content + out
        return content

    def mode2(self):
        if not self.launched:
            self.launched = True
            self.process = pexpect.spawn('mode2 -d /dev/lirc0')
            return ''
        else:
            return 'Stop irrecord first. \n'

    def send_once(self, remotename, codename):
        content = ""
        p = pexpect.spawn('irsend SEND_ONCE ' + remotename + ' ' + codename)
        while True:
            out = p.readline()
            if out == '' and p.eof() is not None:
                break
            if out:
                content = content + out
        return content

    def send(self, command):
        self.process.sendline(command)
        return ''

    def get_config(self):
        if path.isfile(self._LIRCD_CFG_FILE):
            content = ""
            with open(self._LIRCD_CFG_FILE) as f:
                for line in f:
                    content = content + line
        else:
            content = "File not found. \n"
        return content

    def status(self):
        try:
            out = self.process.read_nonblocking(size=1024, timeout=1)
        except:
            if not self.process.isalive():
                out = 'Try again.'
            else:
                out = ''
        return out

    def kill(self):
        self.process.kill(0)
        self.launched = False
        return ''

