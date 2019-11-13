#!/bin/bash

# Pull from update repo
git pull origin master

# Delete image & container
docker rm -f pfalfa-ihub-api
docker image rm -f pfalfa-ihub-api

# Add image & container
docker build -t pfalfa-ihub-api .
docker run --name pfalfa-ihub-api -d -p 3003:3003 pfalfa-ihub-api