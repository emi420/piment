#!/usr/bin/python
# -*- coding: utf-8 -*-

''' 
 Relay - API for Relay Control 

 You may use any Relay project under the terms
 of the GNU General Public License (GPL) Version 3.

 (c) 2016 Emilio Mariscal (emi420 [at] gmail.com)
'''

import RPi.GPIO as GPIO

PIN_RELAY = 18
PIN_READY = 22

class Relay(object):

    def __init__(self):
        GPIO.setmode(GPIO.BOARD)
        GPIO.setup(PIN_READY,GPIO.OUT)
        GPIO.setup(PIN_RELAY,GPIO.OUT)
        GPIO.output(PIN_RELAY,True)
        GPIO.output(PIN_READY,True)

    def stop(self):
        GPIO.cleanup() 

    def on(self, pin):
        GPIO.output(PIN_RELAY,False)

    def off(self, pin):
        GPIO.output(PIN_RELAY,True)
