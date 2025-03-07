#!/bin/bash
cd database && ./install-schema.py http://localhost:28080/admin dno-schema.graphql && cd ..