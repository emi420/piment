
from bluetooth import *
from router import Router

server_sock=BluetoothSocket( RFCOMM )
server_sock.bind(("",PORT_ANY))
server_sock.listen(1)
port = server_sock.getsockname()[1]
uuid = "94f39d29-7d6d-437d-973b-fba39e49d4ee"

router = Router()

advertise_service( server_sock, "BTServer",
                   service_id = uuid,
                   service_classes = [ uuid, SERIAL_PORT_CLASS ],
                   profiles = [ SERIAL_PORT_PROFILE ], 
#                   protocols = [ OBEX_UUID ] 
                    )

while True:          
	print "Waiting for connection on RFCOMM channel %d" % port

	try:
		client_sock, client_info = server_sock.accept()
		print "Accepted connection from ", client_info

		while True:          
			data = client_sock.recv(1024)
			if len(data) == 0: break
			
			print "received [%s]" % data

			url = data.replace('\00','')
			response = router.get(url)

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
					print chunk
					client_sock.send(chunk)
					print str(len(chunk)) + " bytes sent."

	except IOError:
		pass

	except KeyboardInterrupt:
		print "Stopping..."
		server_sock.close()
		stop_advertising(server_sock)
		sys.exit()  

print("disconnected")


