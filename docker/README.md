Versions
--------
These docker images are build with:
- CentOS Stream 9
- Debian 12 (bookworm)
- Ubuntu 22.04 (jammy)

They use the following repositories to install saltstack:
- https://repo.saltproject.io/salt/py3/redhat/9/x86_64/minor/${SALT_VERSION}
- https://repo.saltproject.io/salt/py3/debian/12/amd64/minor/${SALT_VERSION}
- https://repo.saltproject.io/salt/py3/ubuntu/22.04/amd64/minor/${SALT_VERSION}

Version of all salt packages installed: *SALT_VERSION=3007.0*

Docker images
-------------
Commands used to build these docker images (you must be inside `dockerfiles` folder):

## salt master based on ubuntu
```
docker build -f dockerfile-saltmaster --tag erwindon/saltgui-saltmaster:3007.0 .
```

## salt minion based on centos
```
docker build -f dockerfile-saltminion-centos --tag erwindon/saltgui-saltminion-centos:3007.0 .
```

## salt minion based on debian
```
docker build -f dockerfile-saltminion-debian --tag erwindon/saltgui-saltminion-debian:3007.0 .
```

## salt minion based on ubuntu
```
docker build -f dockerfile-saltminion-ubuntu --tag erwindon/saltgui-saltminion-ubuntu:3007.0 .
```

## saltgui-nginx (separated) based on ubuntu
```
docker build -f dockerfile-saltgui-nginx --tag erwindon/saltgui-nginx:1.18.0 .
```
