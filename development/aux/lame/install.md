cd /usr/local/src
wget https://sourceforge.net/projects/lame/files/lame/3.99/lame-3.99.5.tar.gz
tar -xvf lame-3.99.5.tar.gz
rm lame-3.99.5.tar.gz
cd lame-3.99.5
./configure
make
make install