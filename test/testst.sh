#!/bin/bash 
ip="$1"
echo ""
echo "****************************"
echo "***** Test: Status LED *****"
echo "****************************"
echo ""
echo "Status LED ON"
curl "http://$ip/api/relay/on/st"
sleep 1
echo ""
echo "Status LED OFF"
curl "http://$ip/api/relay/off/st"
sleep 1
echo ""
echo "Status LED ON"
curl "http://$ip/api/relay/on/st"
sleep 1
echo ""
echo "Status LED OFF"
curl "http://$ip/api/relay/off/st"
sleep 1
echo ""
echo "Status LED ON"
curl "http://$ip/api/relay/on/st"
sleep 1
echo ""
echo "Status LED OFF"
curl "http://$ip/api/relay/off/st"
sleep 1
echo ""
echo "Status LED ON"
curl "http://$ip/api/relay/on/st"
sleep 1
echo ""
echo "Status LED OFF"
curl "http://$ip/api/relay/off/st"
sleep 1
echo "Done."

