#!/bin/bash 
ip="$1"
echo ""
echo "**************************"
echo "***** Test: Relay ON *****"
echo "**************************"
echo ""
curl "http://$ip/api/relay/on/2.1"
sleep 1
echo ""
curl "http://$ip/api/relay/on/2.2"
sleep 1
echo ""
curl "http://$ip/api/relay/on/3.1"
sleep 1
echo ""
curl "http://$ip/api/relay/on/3.2"
sleep 1
echo ""
curl "http://$ip/api/relay/on/4.1"
sleep 1
echo ""
curl "http://$ip/api/relay/on/4.2"
sleep 1
echo ""
curl "http://$ip/api/relay/on/5.1"
sleep 1
echo ""
curl "http://$ip/api/relay/on/5.2"
sleep 1
echo ""
curl "http://$ip/api/relay/on/6.1"
sleep 1
echo ""
curl "http://$ip/api/relay/on/6.2"
sleep 1
echo ""
curl "http://$ip/api/relay/on/7.1"
sleep 1
echo ""
curl "http://$ip/api/relay/on/7.2"
sleep 1
echo ""
curl "http://$ip/api/relay/on/8.1"
sleep 1
echo ""
curl "http://$ip/api/relay/on/8.2"
echo ""
echo "Done."
