#!/bin/bash 
ip="$1"
echo "Config for 192.168.0.$1"
echo "Removing old repository"
ssh "pi@192.168.0.$ip" rm -rf "~/git/lirc-server"
echo "Creating new repository"
ssh "pi@192.168.0.$ip" git init --bare "~/git/piment"
echo "Removing old origin"
ssh "pi@192.168.0.$ip" cd "~/piment" && git remote rm origin
echo "Adding new origin"
ssh "pi@192.168.0.$ip" cd "~/piment" && git remote add origin ../git/piment
cd ..
echo "Adding new local origin"
git remote add "origin$1" "ssh://pi@192.168.0.$ip/~/git/piment"
echo "Pushing new repository from local to remote"
git push "origin$1" master
cd config
echo "Pulling new repository"
ssh "pi@192.168.0.$ip" cd "~/piment" && git pull origin master
echo "Copying config files"
ssh "pi@192.168.0.$ip" cd "~/piment" && sh ./copyfiles.sh
echo "Rebooting"
ssh "pi@192.168.0.$ip" reboot
