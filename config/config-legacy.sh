#!/bin/bash 
ip="$1"
iplast=$(echo $1| cut -d'.' -f 4)
echo "Config for $ip"
echo ""
echo "Removing old repository ..."
ssh "pi@$ip" "rm -rf ~/git/lirc-server"
echo ""
echo "Creating new repository ..."
ssh "pi@$ip" "git init --bare ~/git/piment"
echo ""
echo "Removing old origin ..."
ssh "pi@$ip" "cd ~/piment && git remote rm origin"
echo ""
echo "Adding new origin ..."
ssh "pi@$ip" "cd ~/piment && git remote add origin ~/git/piment"
cd ..
echo ""
echo "Adding new local origin ..."
git remote add "origin$iplast" "ssh://pi@$ip/~/git/piment"
echo ""
echo "Pushing new repository from local to remote ..."
git push "origin$iplast" master
cd config
echo ""
echo "Pulling new repository ..."
ssh "pi@$ip" "cd ~/piment && git pull origin master"
echo ""
echo "Copying config files ..."
ssh "pi@$ip" "sudo cp ~/piment/config/config.txt /boot/config.txt"
ssh "pi@$ip" "sudo cp ~/piment/config/modules /etc/modules"
echo ""
echo "Done."
