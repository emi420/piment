
#!/bin/bash 
ip="$1"
ssh "pi@$ip" "sudo reboot"
