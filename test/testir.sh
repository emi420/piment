#!/bin/bash 
ip="$1"
echo "*************************"
echo "***** Test: IR Out *****"
echo "************************"
echo ""
echo "Send start"
ssh "pi@$ip" "irsend SEND_START TV KEY_MUTE"
sleep 5 
echo "Send stop"
ssh "pi@$ip" "irsend SEND_STOP TV KEY_MUTE"
echo ""
echo "Test done."
