# How to extract file on centos 

In this post you can see some useful linux
commands and examples. First 4 commands is related to zip, unzip, extract, and
gzip files in centos (linux) systems.

1. Centos unzip command examples To extract a \*.zip compressed file: \$ unzip
   test.zip

View the contents of \*.zip file (Without unzipping it): \$ unzip -l jasper.zip

2. Create or extract tar File examples Create a new tar archive. tar cvf
   archive_name.tar dirname/

Extract from an existing tar archive. tar xvf archive_name.tar

3. Create or Extract gzip files examples To create a \*.gz compressed file: \$
   gzip test.txt

To uncompress a \*.gz file: \$ gzip -d test.txt.gz

4.bzip2 command examples To create a \*.bz2 compressed file: \$ bzip2 test.txt

To uncompress a \*.bz2 file: bzip2 -d test.txt.bz2

5. df command examples Displays the file system disk space usage. By default df
   -k displays output in bytes. \$ df -h

6. rm command examples Following example recursively removes all files and
   directories under the example directory. This also removes the example
   directory itself. \$ rm -r example

7. mv command examples Rename file1 to file2. if file2 exists prompt for
   confirmation before overwritting it. \$ mv -i file1 file2

8. passwd command examples Change your password from command line using passwd.
   This will prompt for the old password followed by the new password. \$ passwd
   Super user can use passwd command to reset others password. This will not
   prompt for current password of the user.

# passwd USERNAME

9. Create directory or folder in centos Following example creates a directory
   called temp under your home directory. \$ mkdir ~/temp

10. Create .txt file in centos Following example creates a .txt file called
    test.txt under your home directory. \$ nano test.txt
