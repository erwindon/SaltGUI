#!/bin/bash

# always cleanup the docker images when something goes wrong
function cleanupdocker {
    docker-compose -f docker/docker-compose.yml rm -f -s
}
trap cleanupdocker EXIT

set -e
# add testing packages
npm i

# first see if we write es6 compatible js
npm run jslint

# and if our css is sane
npm run stylelint

# run the unittests tests before docker for failing fast
npm run test:unit

# start a salt master, three salt minions and saltgui to run tests on
docker-compose -f docker/docker-compose.yml up -d

# wait until all are up
npm run wait-for-docker

# run the nightmare.js functional tests
npm run test:functional

set +e
