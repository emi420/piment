#!/usr/bin/python
# -*- coding: utf-8 -*-

''' 
Piment Router - a router for IR and GPIO 

 You may use any Piment project under the terms
 of the GNU General Public License (GPL) Version 3.

 (c) 2016 Emilio Mariscal (emi420 [at] gmail.com)
 
 
'''
from ir import IR
from relay import Relay
from btpair import BTPair
from os import path as ospath
import pexpect
import re
import string

'''
Router routes addresses to actions
'''
class Router(object):

    ir = None
    relay = None

    def __init__(self):
        self.ir = IR()
        self.relay = Relay()
        self.btpair = BTPair()

    def post(self, path, data):
        """Respond to a POST request."""
        if path == "/api/ir/save-ui-config/":
            result = 'Not saved.'
            with open("remotes-ui.json", "w") as f:
                f.write(data)
                result = 'Saved.'
            return result
        if path == "/api/ir/save-config/":
            return self.ir.save_config(data)

    def get(self, path):
        """Respond to a GET request."""

        response = ""
               
        try:

            if path == "/api/ir/":
                if self.ir.launched:
                    self.ir.kill()
                response = self.ir.launch()

            elif path.startswith("/api/relay/off/"):
                response = self.relay.on(path.replace("/api/relay/on/", ""))
            elif path.startswith("/api/relay/on/"):
                response = self.relay.off(path.replace("/api/relay/off/", ""))

            elif path.startswith("/api/bluetooth/wait/"):
                response = self.btpair.wait()
            elif path.startswith("/api/bluetooth/stop/"):
                response = self.btpair.stop()

            elif path.startswith("/api/config/wifi/scan/"):
                content = ""
                networks = []

                p = pexpect.spawn('iwlist wlan0 scan')
                while True:
                    out = p.readline()
                    if out == '' and p.eof() is not None:
                        break
                    if out:
                        content = content + out

                find_networks = re.findall("ESSID.*$",content,re.MULTILINE)
                find_levels = re.findall("Signal level.*$",content,re.MULTILINE)
                index = 0;
                for item in find_networks:
                    networks.append(item.replace('ESSID:"','').replace('"\r','') + ':' + find_levels[index].replace("Signal level=","").replace(" dBm  \r",""))
                    index+=1

                response = string.join(networks,",")


            elif path.startswith("/api/config/wifi/get/"):
                p = pexpect.spawn('iwgetid')
                response = p.readline().replace('wlan0     ESSID:"','').replace('"','')


            elif path == "/api/get-ui-config/":
                if ospath.isfile("remotes-ui.json"):
                    content = ""
                    with open("remotes-ui.json", "r") as f:
                        for line in f:
                            content = content + line
                else:
                    content = "File not found. \n"
                response = content
            elif path.startswith("/api/lirc/send/"):
                split_path = path.split('/')
                send = split_path[len(split_path)-1]
                cmd = send.split(',')
                self.ir.send_once(cmd[0], cmd[1])
                response = "Command sent."
            elif path.startswith("/api/ir/"):

                if path.endswith("/send/"):
                    split_path = path.split('/')
                    response = self.ir.send(split_path[len(split_path)-3])
                if path == "/api/ir/get-last-config/":
                    response = self.ir.get_last_config()
                if path == "/api/ir/get-config/":
                    response = self.ir.get_config()
                elif path == "/api/ir/get-namespace/":
                    response = self.ir.get_namespace()
                elif path == "/api/ir/mode2/":
                    response = self.ir.mode2()
                elif path == "/api/ir/stop-lirc-service/":
                    response = self.ir.stop_lirc_service()
                elif path == "/api/ir/start-lirc-service/":
                    response = self.ir.start_lirc_service()
                elif path.endswith("/save-last-config/"):
                    split_path = path.split('/');
                    name = split_path[len(split_path)-3]
                    response = self.ir.save_last_config(name)
                else:
                    if not self.ir.launched:
                        response = "IRRecord not launched."
                    else:
                        if path == "/api/ir/enter/":
                            response = self.ir.enter()
                        elif path == "/api/ir/status/":
                            response = self.ir.status()
                        elif path == "/api/ir/kill/":
                            response = self.ir.kill()

        except IOError:
            response = "Error."
            #self.send_error(404,'File Not Found: %s' % path)        

        return response

