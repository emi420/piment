#!/bin/bash 
ip="$1"
echo ""
echo "*************************"
echo "***** Test: Button *****"
echo "************************"
echo ""
echo "Press the button ..."
ssh "pi@$ip" "cd ~/piment/test && python testbtn.py"
echo ""
