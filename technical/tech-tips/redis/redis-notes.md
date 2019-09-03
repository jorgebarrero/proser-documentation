sudo apt-get install redis-server
sudo systemctl enable redis-server.service
sudo vim /etc/redis/redis.conf
maxmemory 256mb
maxmemory-policy allkeys-lru