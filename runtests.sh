#!/bin/bash

# always cleanup the docker images when something goes wrong
function cleanupdocker {
    docker-compose --file docker/docker-compose.yml rm --force --stop
}
trap cleanupdocker EXIT

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
export DEBUG=nightmare:*,electron:*
export NIGHTMARE_DEBUG=1
npm run test:functional

set +e
