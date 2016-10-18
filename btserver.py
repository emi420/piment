#!/usr/bin/python
# -*- coding: utf-8 -*-

''' 
 Bluetooth Server   

 You may use any Piment project under the terms
 of the GNU General Public License (GPL) Version 3.

 (c) 2016 Emilio Mariscal (emi420 [at] gmail.com)
'''

from bluetooth import *
import threading

class BTServer(object):

	_UUID = "94f39d29-7d6d-437d-973b-fba39e49d4ee"

	def __init__(self, router):
		self.router = router

	def listen(self):
		thread = threading.Thread(target=self._listen, args=())
		thread.daemon = True                            
		thread.start() 

	def _listen(self):
		self.server_sock=BluetoothSocket( RFCOMM )
		self.server_sock.bind(("",PORT_ANY))
		self.server_sock.listen(1)

		advertise_service( self.server_sock, "Piment",
		                   service_id = self._UUID,
		                   service_classes = [ self._UUID, SERIAL_PORT_CLASS ],
		                   profiles = [ SERIAL_PORT_PROFILE ] )

		while True:          
			print "Piment Bluetooth Server: waiting for connection on RFCOMM channel %d" % self.server_sock.getsockname()[1]

			client_sock, client_info = self.server_sock.accept()
			print "Accepted connection from ", client_info

			while True:
				try:          
					data = client_sock.recv(1024)
					if len(data) == 0: break

					print "received [%s]" % data

					url = data.replace('\00','')
					response = self.router.get(url);

					if len(response) > 50:
						response = "[data-start]" + response + "[data-end]"
						chunks_count = (len(response) + len(response)/1024 * len("[url:" + url + "] "))/1024
						chunks = []
						for i in range(0,chunks_count):
							chunk = ("[url:" + url + "] " + response)[i*1024:1024+(i*1024)]
							chunks.append(chunk)
						chunk = "[url:" + url + "] " + response[chunks_count*1024:]
						if chunk:
							chunks.append(chunk)
						for chunk in chunks:
							client_sock.send(chunk)
							print str(len(chunk)) + " bytes sent."
					else:
						client_sock.send("[url:" + url + "] " + response)
				except:
					print "Connection closed"
					break

	def stop(self):
		print "Stopping..."
		self.server_sock.close()
		stop_advertising(self.server_sock)
		print("disconnected")


