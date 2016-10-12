#!/usr/bin/python
# -*- coding: utf-8 -*-

''' 
 BTPair - Bluetooth pairing

 You may use any Web Server Admin project under the terms
 of the GNU General Public License (GPL) Version 3.

 (c) 2016 Emilio Mariscal (emi420 [at] gmail.com)
 
 
'''

import pexpect

class main:
    def __init__(self):
    	p = pexpect.spawn('bluetoothctl')
    	p.sendline("power on")
    	p.sendline("agent on")
    	p.sendline("default-agent")
    	p.sendline("discoverable on")
    	p.sendline("scan on")
    	print "Waiting request..."
    	p.expect('Confirm passkey')
    	print "Request confirmation"
    	p.sendline("yes")
    	p.expect('Connected: yes')
    	print "Connected"


if __name__ == '__main__':
    m = main()