#!/bin/sh

saltmaster_host=$1
saltmaster_port=$2
shift 2
cmd="$@"

# wait for the saltmaster docker to be running
while ! nc -z -w 1 $saltmaster_host $saltmaster_port; do
  >&2 echo "Saltmaster is unavailable - sleeping"
  sleep 1
done

>&2 echo "Saltmaster is up - executing command"

# run the command
exec $cmd