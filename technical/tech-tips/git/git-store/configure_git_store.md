# How to configure git store

Run

```
$ git config credential.helper store
```

then

```
$ git pull provide user-name and password
```

and those details will be remembered later.

The credentials are stored in a file on the disk, with the disk permissions of
"just user readable/writable" but still in plaintext.

if you want to change the password later

```
$ git pull
```

---

In Terminal, enter the following to enable credential memory:

```
$ git config --global credential.helper
```

cache You may update the default password cache timeout:

### This cache timeout is in seconds

```
$ git config --global credential.helper 'cache --timeout=3600'
```

You may also use (but please use the single quotes, else double quotes may break
for some characters):

```
$ git config --global user.name 'name'
$ git config --global user.password
```

'password'

---

```
git config credential.helper store
git push
```

wait for... Username: (type your user name)

wait for... Password: (type your password)

other commands

```
$ git help credentials
```
