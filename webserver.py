#!/usr/bin/python
# -*- coding: utf-8 -*-

''' 
 LIRC and Relay Server - a server for LIRC and Relay administration 

 You may use any LIRC and Relay Server Admin project under the terms
 of the GNU General Public License (GPL) Version 3.

 (c) 2016 Emilio Mariscal (emi420 [at] gmail.com)
 
 
'''
from BaseHTTPServer import BaseHTTPRequestHandler, HTTPServer
from os import curdir, sep, path
from router import Router

'''
WebServer create a simple web server
'''
class WebServer(BaseHTTPRequestHandler):

    def get_mime(self):
        """Get MIME type."""
        if self.path.endswith(".png"):
            return "image/png"
        elif self.path.endswith(".jpg"):           
            return "image/jpeg"
        elif self.path.endswith(".js"):           
            return "text/javascript"
        elif self.path.endswith(".css"):           
            return "text/css"
        elif self.path.endswith(".html"):           
            return "text/html"

        elif self.path.endswith(".ttf"):           
            return "application/x-font-truetype"
        elif self.path.endswith(".otf"):           
            return "application/x-font-opentype"
        elif self.path.endswith(".woff"):           
            return "application/font-woff"
        elif self.path.endswith("/"):           
            return "text/html"
        else:           
            return "application/octet-stream"        

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Content-type", "text/html")
        self.send_header('Allow', 'OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')        
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write('')

    def do_POST(self):
        """Respond to a POST request."""
        self.send_response(200)
        self.send_header("Content-type", "text/html")
        self.send_header('Allow', 'POST')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()

        response = self.router.post(self.path, self.rfile.read(int(self.headers['Content-Length'])))
        self.wfile.write(response)

    def do_GET(self):
        """Respond to a GET request."""
               
        try:
            self.send_response(200)
            self.send_header("Content-type", self.get_mime())
            self.send_header('Allow', 'GET')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()

            if self.path.startswith("/api/"):
                response = self.router.get(self.path)
            else:
                if self.path == "/":
                    self.path = "/index.html"

                f = open(curdir + sep + self.path, 'r') 
                response = f.read()
                f.close()

            return self.wfile.write(response)

        except IOError:
            pass
            #self.send_error(404,'File Not Found: %s' % self.path)        

class http_server:
    def __init__(self, router):
        try:
            APIServer.router = Router()

            server = HTTPServer(('', 80), APIServer)
            print 'Started LIRC Web Server on port 80' 
            server.serve_forever()
        except KeyboardInterrupt:
            print '^C received, shutting down server'
            server.socket.close()

class main:
    def __init__(self):
        self.router = Router()
        self.server = http_server(self.router)

if __name__ == '__main__':
    m = main()
