Versions
--------
These docker images are build with Ubuntu 18.04 (bionic) and Debian 9 (stretch). They use the following repositories to install saltstack:
- https://repo.saltstack.com/apt/debian/9/amd64/latest
- http://repo.saltstack.com/py3/ubuntu/18.04/amd64/latest

Version of all salt packages installed: *2018.3.2+ds-1*

Docker images
-------------
Commands used to build these docker images::

    docker build -f dockerfiles/dockerfile-saltmaster -t maerteijn/saltgui-saltmaster .
    docker build -f dockerfiles/dockerfile-saltminion-debian -t maerteijn/saltgui-saltminion-debian .
    docker build -f dockerfiles/dockerfile-saltminion-ubuntu -t maerteijn/saltgui-saltminion-ubuntu .
