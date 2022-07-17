#!/bin/bash

DT=$(date +%Y-%m-%d-%H-%M)
DIR=.bak
FILE="${DIR}/${DT}.tgz"
FILE_EXCLUDE=exclude.tag
mkdir ${DIR} -p
touch .bak/${FILE_EXCLUDE}
touch supaauth_frontend/node_modules/${FILE_EXCLUDE}
touch supaauth_frontend/.vscode/chrome/${FILE_EXCLUDE}
touch supaauth_frontend/.next/cache/${FILE_EXCLUDE}

tar -zcvf ${FILE} \
	--exclude-tag-all=${FILE_EXCLUDE} \
	.
