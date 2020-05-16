#!/bin/sh
set -x
cd dockerfiles
set -e
tag=3000.3
docker build -f dockerfile-saltmaster --tag erwindon/saltgui-saltmaster:$tag .
docker build -f dockerfile-saltminion-ubuntu --tag erwindon/saltgui-saltminion-ubuntu:$tag .
docker build -f dockerfile-saltminion-debian --tag erwindon/saltgui-saltminion-debian:$tag .
docker build -f dockerfile-saltminion-centos --tag erwindon/saltgui-saltminion-centos:$tag .
docker image prune --force
docker push erwindon/saltgui-saltmaster:$tag
docker push erwindon/saltgui-saltminion-ubuntu:$tag
docker push erwindon/saltgui-saltminion-debian:$tag
docker push erwindon/saltgui-saltminion-centos:$tag
# End
