Versions
--------
These docker images are build with:
- CentOS 8.1 (8.1.1911)
- Debian 10 (buster)
- Ubuntu 18.04 (bionic)

They use the following repositories to install saltstack:
- https://repo.saltstack.com/py3/redhat/8.1/x86_64/archive/${SALT_VERSION}
- https://repo.saltstack.com/apt/debian/10/amd64/archive/${SALT_VERSION}
- http://repo.saltstack.com/py3/ubuntu/18.04/amd64/archive/${SALT_VERSION}

Version of all salt packages installed: *SALT_VERSION=3002*

Docker images
-------------
Commands used to build these docker images (you must be inside `dockerfiles` folder):

## salt master based on ubuntu
```
docker build -f dockerfile-saltmaster --tag erwindon/saltgui-saltmaster:3002 .
```

## salt minion based on centos
```
docker build -f dockerfile-saltminion-centos --tag erwindon/saltgui-saltminion-centos:3002 .
```

## salt minion based on debian
```
docker build -f dockerfile-saltminion-debian --tag erwindon/saltgui-saltminion-debian:3002 .
```

## salt minion based on ubuntu
```
docker build -f dockerfile-saltminion-ubuntu --tag erwindon/saltgui-saltminion-ubuntu:3002 .
```

## saltgui-nginx (separated) based on ubuntu
```
docker build -f dockerfile-saltgui-nginx --tag erwindon/saltgui-nginx:1.14.0 .
```
