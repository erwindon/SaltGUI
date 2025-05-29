#!/bin/sh

# show what is going on
set -x

# get the needed software
sudo apt install -y libxss1 libgconf-2-4 libnss3 libasound2 xvfb psmisc

# prevent conflict with a running salt installation
sudo systemctl stop salt-master salt-api
# or a previous running xvfb
killall Xvfb

set -e

# add testing packages
npm install

# first see if we write es6 compatible js
npm run eslint

# and if our css is sane
npm run stylelint

# run the unittests tests before docker for failing fast
# the coverage test will repeat all this
#npm run test:unit

# run the unittests tests and create coverage report
npm run test:coverage

# start a salt master, three salt minions and saltgui to run tests on
# Don't use --detach; travis docker does not understand it
docker-compose --file docker/docker-compose.yml up -d

# wait until all are up
npm run wait-for-docker

# run the nightmare.js functional tests
# when debugging is needed:
#export DEBUG=nightmare:*,electron:*
#export NIGHTMARE_DEBUG=1
# suppress Electron Security Warnings:
export ELECTRON_DISABLE_SECURITY_WARNINGS=true
xvfb-run npm run test:functional

# remove the containers
docker-compose --file docker/docker-compose.yml rm --force --stop

# start the usual software again
sudo systemctl start salt-master salt-api

echo "DONE!"
