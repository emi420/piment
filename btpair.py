#!/usr/bin/python
# -*- coding: utf-8 -*-

''' 
 BTPair - Bluetooth pairing

 You may use any Piment project under the terms
 of the GNU General Public License (GPL) Version 3.

 (c) 2016 Emilio Mariscal (emi420 [at] gmail.com)
 
'''

import pexpect

class BTPair(object):

    waiting = False
    _DEVICE_NAME = "Piment"

    def __init__(self):
        waiting = False
        pexpect.spawn('hciconfig hci0 name ' + self._DEVICE_NAME)

    def wait(self):
    	self.waiting = True
    	self.p = pexpect.spawn('bluetoothctl')
    	self.p.sendline("power on")
    	self.p.sendline("agent on")
    	self.p.sendline("default-agent")
    	self.p.sendline("discoverable on")
    	self.p.sendline("scan on")
    	print "Waiting request..."
    	self.p.expect('Confirm passkey')
    	print "Request confirmation"
    	self.p.sendline("yes")
    	self.p.expect('Paired: yes')
    	print "Paired"
        return "Paired"

	def stop(self):
		self.p.kill(0)
		self.waiting = False
		return "Stopped"
