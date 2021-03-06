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

		advertise_service( self.server_sock, "HAS",
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
					response = "[data-start]" + self.router.get(url) + "[data-end]";

					chunk_size = 1024 - len("[url:" + url + "] ")
					chunks_count = len(response)/chunk_size
					chunks = []
					for i in range(0,chunks_count):
						chunk = "[url:" + url + "] " + response[i*chunk_size:chunk_size+(i*chunk_size)]
						chunks.append(chunk)
					chunk = "[url:" + url + "] " + response[chunks_count*chunk_size:]
					if chunk:
						chunks.append(chunk)
					for chunk in chunks:
						client_sock.send(chunk)
						print str(len(chunk)) + " bytes sent."

				except:
					print "Connection closed"
					break

	def stop(self):
		print "Stopping..."
		self.server_sock.close()
		stop_advertising(self.server_sock)
		print("disconnected")


