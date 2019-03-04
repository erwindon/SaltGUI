#!/bin/bash

# always cleanup the docker images when something goes wrong
function cleanupdocker {
    docker-compose -f docker/docker-compose.yml rm -f -s
}
trap cleanupdocker EXIT

set -e
# add testing packages
npm i

# trigger build
npm run build

# run the unittests tests before docker for failing fast
npm run test:unit

# run the unittests tests and create coverage report
npm run test:coverage

# start a salt master, three salt minions and saltgui to run tests on
docker-compose -f docker/docker-compose.yml up -d

# wait until all are up
npm run wait-for-docker

# run the nightmare.js functional tests
npm run test:functional

set +e
