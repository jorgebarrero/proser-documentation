## Install MariaDB 10.3 on CentOS 7
Install yum

First add MariaDB yum repository in our system. Create a new repo file /etc/yum.repos.d/mariadb.repo in your system and add below code:
--
# MariaDB 10.3 CentOS repository list - created 2019-02-03 17:47 UTC
# http://downloads.mariadb.org/mariadb/repositories/
[mariadb]
name = MariaDB
baseurl = http://yum.mariadb.org/10.3/centos7-amd64
gpgkey=https://yum.mariadb.org/RPM-GPG-KEY-MariaDB
gpgcheck=1
--

sudo yum install MariaDB-server MariaDB-client

Once the installation is complete, enable MariaDB to start on boot and start the service:

# systemctl enable mariadb
# systemctl start mariadb

To verify the installation check the MariaDB service status by typing:

# systemctl status mariadb


###################################

Install MariaDB 10.3 on CentOS 7
 3
MariaDB is an open source relational database management system, backward compatible, binary drop-in replacement of MySQL. It is developed by some of the original developers of the MySQL and by many people in the community. With the release of CentOS 7, MySQL was replaced with MariaDB as the default database system.
In this tutorial we will show you how to install the latest version of MariaDB on CentOS 7 using the official MariaDB repositories.

Install MariaDB 10.3 on CentOS 7
First add MariaDB yum repository in our system. Create a new repo file /etc/yum.repos.d/mariadb.repo in your system and add below code:

# MariaDB 10.3 CentOS repository list - created 2019-02-03 17:47 UTC
# http://downloads.mariadb.org/mariadb/repositories/
[mariadb]
name = MariaDB
baseurl = http://yum.mariadb.org/10.3/centos7-amd64
gpgkey=https://yum.mariadb.org/RPM-GPG-KEY-MariaDB
gpgcheck=1
Install the MariaDB server and client packages using yum, same as other CentOS package:

# sudo yum install MariaDB-server MariaDB-client
Once the installation is complete, enable MariaDB to start on boot and start the service:

# systemctl enable mariadb
# systemctl start mariadb
To verify the installation check the MariaDB service status by typing:

# systemctl status mariadb
Example output:

[root@lintut ~]# systemctl status mariadb
● mariadb.service - MariaDB 10.3.12 database server
   Loaded: loaded (/usr/lib/systemd/system/mariadb.service; enabled; vendor preset: disabled)
  Drop-In: /etc/systemd/system/mariadb.service.d
           └─migrated-from-my.cnf-settings.conf
   Active: active (running) since Sun 2019-02-03 17:56:25 UTC; 6s ago
     Docs: man:mysqld(8)
           https://mariadb.com/kb/en/library/systemd/

 

You also need to secure your MariaDB installation using passwords and do some other changes. To do this run secure installation script from command line.
# mysql_secure_installation
The secure installation script will ask for user input as some points, follow the installation as per below output showing, All user inputs are highlighted with red color.

[root@lintut ~]# mysql_secure_installation

NOTE: RUNNING ALL PARTS OF THIS SCRIPT IS RECOMMENDED FOR ALL MariaDB
      SERVERS IN PRODUCTION USE!  PLEASE READ EACH STEP CAREFULLY!

In order to log into MariaDB to secure it, we'll need the current
password for the root user.  If you've just installed MariaDB, and
you haven't set the root password yet, the password will be blank,
so you should just press enter here.

Enter current password for root (enter for none):
OK, successfully used password, moving on...

Setting the root password ensures that nobody can log into the MariaDB
root user without the proper authorisation.

Set root password? [Y/n] Y
New password:
Re-enter new password:
Password updated successfully!
Reloading privilege tables..
 ... Success!


By default, a MariaDB installation has an anonymous user, allowing anyone
to log into MariaDB without having to have a user account created for
them.  This is intended only for testing, and to make the installation
go a bit smoother.  You should remove them before moving into a
production environment.

Remove anonymous users? [Y/n] Y
 ... Success!

Normally, root should only be allowed to connect from 'localhost'.  This
ensures that someone cannot guess at the root password from the network.

Disallow root login remotely? [Y/n] Y
 ... Success!

By default, MariaDB comes with a database named 'test' that anyone can
access.  This is also intended only for testing, and should be removed
before moving into a production environment.

Remove test database and access to it? [Y/n] Y
 - Dropping test database...
 ... Success!
 - Removing privileges on test database...
 ... Success!

Reloading the privilege tables will ensure that all changes made so far
will take effect immediately.

Reload privilege tables now? [Y/n] Y
 ... Success!

Cleaning up...

All done!  If you've completed all of the above steps, your MariaDB
installation should now be secure.

Thanks for using MariaDB!
Connect to MariaDB from the command line
After installing and completing the configuration, connect to MariaDB server using the following command.

# mysql -u root -p
You will be prompted to enter the root password you have previously set when the mysql_secure_installation script was run.
Once you enter the password you will be presented with the MariaDB shell as shown below:

[root@lintut ~]# mysql -u root -p
Enter password:
Welcome to the MariaDB monitor.  Commands end with ; or \g.
Your MariaDB connection id is 17
Server version: 10.3.12-MariaDB MariaDB Server

Copyright (c) 2000, 2018, Oracle, MariaDB Corporation Ab and others.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

MariaDB [(none)]>
Conclusion
In this tutorial, we’ve shown you how to install and secure MariaDB on a CentOS 7 server.
If you have any questions or thoughts to add to this guide, use the comment form below to reach us.
