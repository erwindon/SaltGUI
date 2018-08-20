#!/bin/bash

# This script is a BASH script, therefore the interpreter must be BASH
[ "$BASH" != "" ] || { echo "$0: must use bash"; exit 1; }

# Docker must be started as root, therefore this script must run as root
[ "$UID" = "0" ] || { echo "$0: must be root"; exit 1; }

# always cleanup the docker images when something goes wrong
function cleanupdocker {
    docker-compose -f docker/docker-compose.yml rm -f -s
}
trap cleanupdocker EXIT

set -e
# add testing packages
yarn

# first see if we write es6 compatible js
yarn jslint

# and if our css is sane
yarn stylelint

# start a salt master, two salt minions and saltgui to run tests on
docker-compose -f docker/docker-compose.yml up -d

# wait until all are up
yarn wait-for-docker

# run the unittests/nightmare.js functional tests
yarn test

set +e
