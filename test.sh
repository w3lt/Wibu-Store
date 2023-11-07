#!/bin/bash

KEY_FILE="key.txt"

if [ ! -e "$KEY_FILE" ]; then
    echo -e "Please create key file. You can use the command \033[32mtouch key.txt\033[0m!";
    exit 1;
fi;

PRIVATE_TEST_KEY=$(head -n 1 key.txt)
echo "STRIPE_KEY='$PRIVATE_TEST_KEY'" > server/.env
PUBLIC_TEST_KEY=$(tail -n 1 key.txt)
echo "REACT_APP_STRIPE_KEY='$PUBLIC_TEST_KEY'" > front-end/.env

docker-compose up -d