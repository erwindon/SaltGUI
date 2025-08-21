#!/bin/sh

set -e

# start a salt master, three salt minions and saltgui to run tests on
# Don't use --detach; travis docker does not understand it
docker-compose --file docker-compose.yml up -d

# wait until user decides
echo "Please use http://localhost:3333 for SaltGUI (Username='salt', Password='salt')"
echo -n "Press ENTER to stop $0"; read dummy

# remove the containers
docker-compose --file docker-compose.yml rm --force --stop

echo "DONE!"

# End
