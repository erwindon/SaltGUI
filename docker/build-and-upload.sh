#!/bin/sh
set -x
cd dockerfiles
set -e
tag=3007.0
docker build -f dockerfile-saltmaster --tag erwindon/saltgui-saltmaster:$tag --tag erwindon/saltgui-saltmaster:latest .
docker build -f dockerfile-saltminion-ubuntu --tag erwindon/saltgui-saltminion-ubuntu:$tag --tag erwindon/saltgui-saltminion-ubuntu:latest .
docker build -f dockerfile-saltminion-debian --tag erwindon/saltgui-saltminion-debian:$tag --tag erwindon/saltgui-saltminion-debian:latest .
docker build -f dockerfile-saltminion-centos --tag erwindon/saltgui-saltminion-centos:$tag --tag erwindon/saltgui-saltminion-centos:latest .
docker container ls -aq | xargs --no-run-if-empty docker container rm --force
docker images | awk '/^<none>/ {print $3;}' | xargs --no-run-if-empty docker rmi
for t in $tag latest; do
	# this needs "docker login"
	docker push erwindon/saltgui-saltmaster:$t
	docker push erwindon/saltgui-saltminion-ubuntu:$t
	docker push erwindon/saltgui-saltminion-debian:$t
	docker push erwindon/saltgui-saltminion-centos:$t
done
docker system prune --force --filter "until=12h"
docker images
# End
