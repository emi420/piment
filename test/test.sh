#!/bin/bash 
ip="$1"
./testst.sh $1
./testrelay.sh $1
./testbtn.sh $1
./testir.sh $1
