#!/bin/bash
while [ true ]; do
   sleep 5
   echo "Y" | salt-key -A
done