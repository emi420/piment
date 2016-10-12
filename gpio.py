#!/usr/bin/python
# -*- coding: utf-8 -*-

''' 
 Piment GPIO - API for GPIO  

 You may use any Piment project under the terms
 of the GNU General Public License (GPL) Version 3.

 (c) 2016 Emilio Mariscal (emi420 [at] gmail.com)
'''

import RPi.GPIO as GPIO

PIN_READY = 40

PIN_RELAY = {
    "1": 38,
    "2": 36,
    "3": 32,
    "4": 26,
    "5": 24,
    "6": 22,
    "7": 18,
    "8": 15,
}
class Relay(object):

    def __init__(self):
        #GPIO.setmode(GPIO.BOARD)
        #GPIO.setup(PIN_READY,GPIO.OUT)
        #GPIO.setup(PIN_RELAY,GPIO.OUT)
        #GPIO.output(PIN_RELAY,True)
        #GPIO.output(PIN_READY,True)

    def stop(self):
        #GPIO.cleanup() 

    def on(self, pin):
        #if pin:
        #    GPIO.output(PIN_RELAY[pin],False)

    def off(self, pin):
        #if pin:
        #    GPIO.output(PIN_RELAY[pin],True)
