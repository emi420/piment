#!/usr/bin/python
# -*- coding: utf-8 -*-

''' 
 Piment GPIO - API for GPIO  

 You may use any Piment project under the terms
 of the GNU General Public License (GPL) Version 3.

 (c) 2016 Emilio Mariscal (emi420 [at] gmail.com)
'''

import RPi.GPIO as GPIO
import threading
from btpair import BTPair
from time import sleep

PIN_RELAY = {
    "2.1": 36,
    "2.2": 32,
    "3.1": 10,
    "3.2": 8,
    "4.1": 37,
    "st": 22,
}

STATE_ON_RELAYS = ["2.1","2.2","3.1","3.2"]

class Relay(object):

    def __init__(self):
        GPIO.setmode(GPIO.BOARD)

        for pin in PIN_RELAY:
            GPIO.setup(PIN_RELAY[pin], GPIO.OUT)
            if pin not in STATE_ON_RELAYS:
                GPIO.output(PIN_RELAY[pin],False)
            else:
                GPIO.output(PIN_RELAY[pin],True)

        GPIO.setup(29, GPIO.IN, pull_up_down=GPIO.PUD_UP)        
        self.btpair = BTPair()
        self.listen()


    def listen(self):
        pass

    def stop(self):
        GPIO.cleanup() 

    def on(self, pin):
        if pin:
            GPIO.output(PIN_RELAY[pin],True)
            return pin + ":true"
        return "No pin provided."


    def off(self, pin):
        if pin:
            GPIO.output(PIN_RELAY[pin],False)
            return pin + ":false"
        return "No pin provided."


    def onoff(self, pin):
        if pin:
            GPIO.output(PIN_RELAY[pin],True)
            sleep(.2)
            GPIO.output(PIN_RELAY[pin],False)
            return pin + ":false"
        return "No pin provided."

    def offon(self, pin):
        if pin:
            GPIO.output(PIN_RELAY[pin],False)
            sleep(.5)
            GPIO.output(PIN_RELAY[pin],True)
            return pin + ":true"
        return "No pin provided."

