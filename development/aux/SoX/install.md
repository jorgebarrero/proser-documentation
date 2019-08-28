Installing SoX with MP3 Support on CentOS

sound

or how to fix error: sox formats: no handler for file extension `mp3′

Default SoX installation from yum doesn’t have mp3 handler:

AUDIO FILE FORMATS: 8svx aif aifc aiff aiffc al amb au avr caf cdda cdr cvs cvsd dat dvms f4 f8 fap flac fssd gsm hcom htk ima ircam la lpc lpc10 lu mat mat4 mat5 maud nist ogg paf prc pvf raw s1 s2 s3 s4 sb sd2 sds sf sl smp snd sndfile sndr sndt sou sox sph sw txw u1 u2 u3 u4 ub ul uw vms voc vorbis vox w64 wav wavpcm wv wve xa xi
PLAYLIST FORMATS: m3u pls
AUDIO DEVICE DRIVERS: alsa ao oss ossdsp

If you already have SoX installed form yum you need remove it:

# yum remove sox

You will need install the rpmforge repo.

Then install gcc-c++ libmad libmad-devel libid3tag libid3tag-devel lame lame-devel flac-devel libvorbis-devel packages:

# yum install gcc-c++ libmad libmad-devel libid3tag libid3tag-devel lame lame-devel flac-devel libvorbis-devel

Create /usr/local/src/SoX directory, download, extract sox from sources:

# mkdir /usr/local/src/SoX
# cd /usr/local/src/SoX/
# wget https://sourceforge.net/projects/sox/files/sox/14.4.2/sox-14.4.2.tar.gz
# tar xvfz sox-14.4.2.tar.gz
# cd sox-14.4.2
# ./configure

After running ./configure you should see in output:

OPTIONAL FILE FORMATS
amrnb.....................no
amrwb.....................no
flac......................yes
gsm.......................yes (in-tree)
lpc10.....................yes (in-tree)
mp2/mp3...................yes
id3tag....................yes  
lame......................yes 
lame id3tag...............yes
dlopen lame...............no
mad.......................yes
dlopen mad................no
twolame...................no
oggvorbis.................yes
opus......................no
sndfile...................no
wavpack...................no

Finlay run:

# make -s
# make install

That’s it. Now your new compiled sox with mp3 support in /usr/local/bin/ folder.

You can add /usr/local/sbin to the PATH:

# export PATH=$PATH:/usr/local/bin