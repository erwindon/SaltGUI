#!/bin/bash

PACKAGE_MANAGER=${PACKAGE_MANAGER:-yarn}



# always cleanup the docker images when something goes wrong
function cleanupdocker {
    docker-compose -f docker/docker-compose.yml rm -f -s
}
trap cleanupdocker EXIT

set -e
# add testing packages
$PACKAGE_MANAGER i

# run lint checks and bundle application
$PACKAGE_MANAGER run build

# run tests with coverage and report it to coveralls
$PACKAGE_MANAGER run test:unit
$PACKAGE_MANAGER run test:coverage 
$PACKAGE_MANAGER run report:coveralls

# start a salt master, three salt minions and saltgui to run tests on
docker-compose -f docker/docker-compose.yml up -d

# wait until all are up
$PACKAGE_MANAGER run wait-for-docker

# run the unittests/nightmare.js functional tests
$PACKAGE_MANAGER run test:functional

set +e
