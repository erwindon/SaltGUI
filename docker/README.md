Versions
--------
These docker images are build with:
- CentOS 7 (7.6.1810)
- Debian 9 (stretch)
- Ubuntu 18.04 (bionic)

They use the following repositories to install saltstack:
- https://repo.saltstack.com/py3/redhat/7/x86_64/latest/
- https://repo.saltstack.com/apt/debian/9/amd64/latest
- http://repo.saltstack.com/py3/ubuntu/18.04/amd64/latest

Version of all salt packages installed: *latest*

Docker images
-------------
Commands used to build these docker images (you must be inside `dockerfiles` folder):

## salt master based on ubuntu
```
docker build -f dockerfile-saltmaster --tag maerteijn/saltgui-saltmaster .
```

## salt minion based on centos
```
docker build -f dockerfile-saltminion-centos --tag maerteijn/saltgui-saltminion-centos .
```

## salt minion based on debian
```
docker build -f dockerfile-saltminion-debian --tag maerteijn/saltgui-saltminion-debian .
```

## salt minion based on ubuntu
```
docker build -f dockerfile-saltminion-ubuntu --tag maerteijn/saltgui-saltminion-ubuntu .
```
