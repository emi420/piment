#!/bin/bash 
ip="$1"
echo ""
echo "***************************"
echo "***** Test: Relay OFF *****"
echo "***************************"
echo ""
curl "http://$ip/api/relay/off/2.1"
sleep 1
echo ""
curl "http://$ip/api/relay/off/2.2"
sleep 1
echo ""
curl "http://$ip/api/relay/off/3.1"
sleep 1
echo ""
curl "http://$ip/api/relay/off/3.2"
sleep 1
echo ""
curl "http://$ip/api/relay/off/4.1"
sleep 1
echo ""
curl "http://$ip/api/relay/off/4.2"
sleep 1
echo ""
curl "http://$ip/api/relay/off/5.1"
sleep 1
echo ""
curl "http://$ip/api/relay/off/5.2"
sleep 1
echo ""
curl "http://$ip/api/relay/off/6.1"
sleep 1
echo ""
curl "http://$ip/api/relay/off/6.2"
sleep 1
echo ""
curl "http://$ip/api/relay/off/7.1"
sleep 1
echo ""
curl "http://$ip/api/relay/off/7.2"
sleep 1
echo ""
curl "http://$ip/api/relay/off/8.1"
sleep 1
echo ""
curl "http://$ip/api/relay/off/8.2"
echo ""
echo "Done."

