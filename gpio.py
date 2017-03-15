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
    "2.1": 37,
    "2.2": 35,
    "3.1": 31,
    "3.2": 33,
    "4.1": 40,
    "4.2": 38,
    "5.1": 32,
    "5.2": 36,
    "6.1": 26,
    "6.2": 24,
    "7.1": 11,
    "7.2": 13,
    "8.1": 10,
    "8.2": 8,
    "st": 22,
}

class Relay(object):

    def __init__(self):
        GPIO.setmode(GPIO.BOARD)

        for pin in PIN_RELAY:
            GPIO.setup(PIN_RELAY[pin], GPIO.OUT)

        GPIO.setup(29, GPIO.IN, pull_up_down=GPIO.PUD_UP)        
        self.btpair = BTPair()
        self.listen()


    def listen(self):
        def watch_button():
            while True:
                input_state = GPIO.input(29)
                if input_state == False:
                    res = self.btpair.wait()
                    print(res)
                sleep(0.10)            

        thread = threading.Thread(target=watch_button, args=())
        thread.daemon = True                            
        thread.start() 

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
            sleep(.5)
            GPIO.output(PIN_RELAY[pin],False)
            return pin + ":false"
        return "No pin provided."

    def offon(self, pin):
        if pin:
            GPIO.output(PIN_RELAY[pin],False)
            sleep(1)
            GPIO.output(PIN_RELAY[pin],True)
            return pin + ":true"
        return "No pin provided."

