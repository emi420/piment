#!/usr/bin/python
# -*- coding: utf-8 -*-

''' 
 LIRC and Relay Server - a server for LIRC and Relay administration 

 You may use any LIRC and Relay Server Admin project under the terms
 of the GNU General Public License (GPL) Version 3.

 (c) 2016 Emilio Mariscal (emi420 [at] gmail.com)
 
 
'''
from irrecord import IRRecord
from lirc import Lirc
from relay import Relay

'''
Router routes addresses to actions
'''
class Router(object):

    irrecord = None
    lirc = None
    relay = None

    def __init__(self):
        self.irrecord = IRRecord()
        self.lirc = Lirc()
        self.relay = Relay()

    def post(self, data):
        """Respond to a POST request."""
        if self.path == "/api/irrecord/save-ui-config/":
            result = 'Not saved.'
            with open("remotes-ui.json", "w") as f:
                f.write(data)
                result = 'Saved.'
            return result

    def get(self):
        """Respond to a GET request."""

        response = ""
               
        try:

            if self.path == "/api/irrecord/":
                if self.irrecord.launched:
                    self.irrecord.kill()
                response = self.irrecord.launch()

            elif self.path.startswith("/api/relay/off/"):
                response = self.relay.on(self.path.replace("/api/relay/on/", ""))
            elif self.path.startswith("/api/relay/on/"):
                response = self.relay.off(self.path.replace("/api/relay/off/", ""))

            elif self.path == "/api/get-ui-config/":
                if path.isfile("remotes-ui.json"):
                    content = ""
                    with open("remotes-ui.json", "r") as f:
                        for line in f:
                            content = content + line
                else:
                    content = "File not found. \n"
                response = content
            elif self.path.startswith("/api/lirc/send/"):
                split_path = self.path.split('/')
                send = split_path[len(split_path)-1]
                cmd = send.split(',')
                self.lirc.send_once(cmd[0], cmd[1])
                response = "Command sent."
            elif self.path.startswith("/api/irrecord/"):

                if self.path.endswith("/send/"):
                    split_path = self.path.split('/')
                    response = self.irrecord.send(split_path[len(split_path)-3])
                if self.path == "/api/irrecord/get-last-config/":
                    response = self.irrecord.get_last_config()
                elif response =.path == "/api/irrecord/get-namespace/":
                    response = self.irrecord.get_namespace()
                elif self.path == "/api/irrecord/mode2/":
                    response = self.irrecord.mode2()
                elif self.path == "/api/irrecord/stop-lirc-service/":
                    response = self.irrecord.stop_lirc_service()
                elif self.path == "/api/irrecord/start-lirc-service/":
                    response = self.irrecord.start_lirc_service()
                elif self.path == "/api/irrecord/get-remotes/":
                    response = self.irrecord.get_remotes()
                elif self.path.endswith("/save-last-config/"):
                    split_path = self.path.split('/');
                    name = split_path[len(split_path)-3]
                    response = self.irrecord.save_last_config(name)
                else:
                    if not self.irrecord.launched:
                        response = "IRRecord not launched."
                    else:
                        if self.path == "/api/irrecord/enter/":
                            response = self.irrecord.enter()
                        elif self.path == "/api/irrecord/status/":
                            response = self.irrecord.status()
                        elif self.path == "/api/irrecord/kill/":
                            response = self.irrecord.kill()

        except IOError:
            response = "Error."
            #self.send_error(404,'File Not Found: %s' % self.path)        

        return response

