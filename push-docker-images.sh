#!/bin/bash 

docker compose --profile production up --build -d 

docker login docker.io

docker image tag dando-dao-server m2tec/dando-dao-server
docker image tag dando-dao-monitor m2tec/dando-dao-monitor

docker push m2tec/dando-dao-server
docker push m2tec/dando-dao-monitor