#!/bin/bash
set -x
docker compose --profile production up --build -d

