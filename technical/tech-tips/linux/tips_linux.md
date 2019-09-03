## kill open unresponsive application

- get pid
sudo netstat -lnp
- then
kill pid


## close a port

sudo kill $(sudo lsof -t -i:3151)


sudo netstat -ap | grep :3151

lsof -n | grep LISTEN

To filter for a specific port use the following:
lsof -n -i4TCP:[PORT] | grep LISTEN

To kill all processes listening on a specific port use:
lsof -n -i4TCP:[PORT] | grep LISTEN | awk '{ print $2 }' | xargs kill


## Install htop
yum -y install htop
