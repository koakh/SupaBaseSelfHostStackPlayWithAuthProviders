#!/bin/bash

[[ EUID -ne 0 ]] && echo "This script must be run as root." && exit 1

docker-compose down --remove-orphans
rm volumes/db/data/ -R
