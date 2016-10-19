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
    "2.1": 37,
    "2.2": 35,
    "3.1": 33,
    "3.2": 31,
    "4.1": 40,
    "4.2": 38,
    "5.1": 36,
    "5.2": 32,
    "6.1": 26,
    "6.2": 24,
    "7.1": 18,
    "7.2": 29,
    "8.1": 10,
    "8.2": 8,
}

class Relay(object):

    def __init__(self):
        GPIO.setmode(GPIO.BOARD)
        GPIO.setup(PIN_READY,GPIO.OUT)

        for pin in PIN_RELAY:
            GPIO.setup(PIN_RELAY[pin],GPIO.OUT)

        GPIO.output(PIN_READY,True)

    def stop(self):
        GPIO.cleanup() 

    def on(self, pin):
        print pin + " ON"
        if pin:
            GPIO.output(PIN_RELAY[pin],False)
            return "Relay " + pin + " ON."
        return "No pin provided."


    def off(self, pin):
        print pin + " OFF"
        if pin:
            GPIO.output(PIN_RELAY[pin],True)
            return "Relay " + pin + " OFF."
        return "No pin provided."


