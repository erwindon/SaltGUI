#!/bin/bash

set -e
# add testing packages
yarn

# first see if we write es6 compatible js
yarn lint

# start a salt master, two salt minions and saltgui to run tests on
docker-compose -f docker/docker-compose.yml up -d

# wait until all are up
yarn wait-for-docker

# run the unittests/nightmare.js functional tests
yarn test

# cleanup the docker images for 100% reproducable testresults
docker-compose -f docker/docker-compose.yml rm -f -s

set +e
