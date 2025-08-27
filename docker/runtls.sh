#!/bin/sh

set -e

# start a salt master, three salt minions and saltgui to run tests on
# Don't use --detach; travis docker does not understand it
docker-compose --file docker-compose-tls.yml up -d

# wait until user decides
echo "Please use https://localhost:3334 for SaltGUI (Username='salt', Password='salt')"
echo -n "Press ENTER to stop $0"; read dummy

# remove the containers
docker-compose --file docker-compose-tls.yml rm --force --stop

echo "DONE!"

# End
