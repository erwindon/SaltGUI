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

Version of all salt packages installed: *SALT_VERSION=3007.4*

Docker images
-------------
Commands used to build these docker images (you must be inside `dockerfiles` folder):

## salt master based on ubuntu (HTTP)
```
docker build -f dockerfile-saltmaster --tag erwindon/saltgui-saltmaster:3007.4 .
```

## salt master based on ubuntu with SSL (HTTPS)
```
docker build -f dockerfile-saltmaster-ssl --tag erwindon/saltgui-saltmaster-ssl:3007.4 .
```

## salt minion based on centos
```
docker build -f dockerfile-saltminion-centos --tag erwindon/saltgui-saltminion-centos:3007.4 .
```

## salt minion based on debian
```
docker build -f dockerfile-saltminion-debian --tag erwindon/saltgui-saltminion-debian:3007.4 .
```

## salt minion based on ubuntu
```
docker build -f dockerfile-saltminion-ubuntu --tag erwindon/saltgui-saltminion-ubuntu:3007.4 .
```

## saltgui-nginx (separated) based on ubuntu
```
docker build -f dockerfile-saltgui-nginx --tag erwindon/saltgui-nginx:1.18.0 .
```

## Running SaltGUI with Docker Compose

### HTTP Setup (Development/Testing)
For basic testing and development:
```bash
docker-compose up
```
- Access SaltGUI at: http://localhost:3333
- Login: salt / salt
- Uses unencrypted HTTP connection

### HTTPS Setup (Production/Secure Testing)
For secure connections with SSL/TLS:
```bash
docker-compose -f docker-compose-ssl.yml up
```
- Access SaltGUI at: https://localhost:3334
- Login: salt / salt
- Uses encrypted HTTPS connection with self-signed certificates
- Browser will show security warning (accept for testing)

### Custom SSL Certificates
To use your own SSL certificates with the SSL setup:

1. Create a directory with your certificates:
   ```
   mkdir -p ./ssl-certs
   cp your-server.crt ./ssl-certs/server.crt
   cp your-server.key ./ssl-certs/server.key
   ```

2. Modify docker-compose-ssl.yml to mount your certificates:
   ```yaml
   volumes:
     - ./ssl-certs:/etc/ssl/saltgui
   ```

3. Start the services:
   ```bash
   docker-compose -f docker-compose-ssl.yml up
   ```
