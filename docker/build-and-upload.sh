#!/bin/sh
set -x
cd dockerfiles
set -e
tag=3002
docker build -f dockerfile-saltmaster --tag erwindon/saltgui-saltmaster:$tag --tag erwindon/saltgui-saltmaster:latest .
docker build -f dockerfile-saltminion-ubuntu --tag erwindon/saltgui-saltminion-ubuntu:$tag --tag erwindon/saltgui-saltminion-ubuntu:latest .
docker build -f dockerfile-saltminion-debian --tag erwindon/saltgui-saltminion-debian:$tag --tag erwindon/saltgui-saltminion-debian:latest .
docker build -f dockerfile-saltminion-centos --tag erwindon/saltgui-saltminion-centos:$tag --tag erwindon/saltgui-saltminion-centos:latest .
docker images | awk "/^<none>/ {print $3;}" | xargs --no-run-if-empty docker rmi
for t in $tag latest; do
	docker push erwindon/saltgui-saltmaster:$t
	docker push erwindon/saltgui-saltminion-ubuntu:$t
	docker push erwindon/saltgui-saltminion-debian:$t
	docker push erwindon/saltgui-saltminion-centos:$t
done
docker system prune -f
docker images
# End
