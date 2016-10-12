#!/usr/bin/python
# -*- coding: utf-8 -*-

''' 
 Bluetooth Server   

 You may use any Piment project under the terms
 of the GNU General Public License (GPL) Version 3.

 (c) 2016 Emilio Mariscal (emi420 [at] gmail.com)
'''

from bluetooth import *

class BTServer(object):

	_UUID = "94f39d29-7d6d-437d-973b-fba39e49d4ee"

	def __init__(self, router):
		self.router = router

	def listen(self):
		print "Piment Bluetooth Server"
		self.server_sock=BluetoothSocket( RFCOMM )
		self.server_sock.bind(("",PORT_ANY))
		self.server_sock.listen(1)

		advertise_service( self.server_sock, "Piment",
		                   service_id = self._UUID,
		                   service_classes = [ self._UUID, SERIAL_PORT_CLASS ],
		                   profiles = [ SERIAL_PORT_PROFILE ] )

		while True:          
			print "Waiting for connection on RFCOMM channel %d" % self.server_sock.getsockname()[1]

			client_sock, client_info = self.server_sock.accept()
			print "Accepted connection from ", client_info

			while True:          
				data = client_sock.recv(1024)
				if len(data) == 0: break

				print "received [%s]" % data

				url = data.replace('\00','')
				response = self.router.get(url)

				if response != "" and len(response) > 50:
					response = "[data-start]" + response + "[data-end]"
					chunks_count = len(response)/1024
					chunks = []
					for i in range(0,chunks_count):
						chunk = response[i*1024:1024+(i*1024)]
						chunks.append(chunk)
					chunk = response[chunks_count*1024:]
					if chunk:
						chunks.append(chunk)
					for chunk in chunks:
						client_sock.send(chunk)
						print str(len(chunk)) + " bytes sent."

	def stop(self):
		print "Stopping..."
		self.server_sock.close()
		stop_advertising(self.server_sock)
		print("disconnected")


