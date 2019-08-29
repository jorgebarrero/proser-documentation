

On a fresh install on CENTOS7 I have tried the above methods (edit phpMyAdmin.conf and add Require all granted), it still does'nt work. Here is the solution : install the mod_php module :

$ sudo yum install php

then restart httpd :

$ sudo systemctl restart httpd

and voila !
