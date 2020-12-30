#!/bin/bash
docker build -t my-node-app .
docker stop my-node-app && docker rm my-node-app
docker stop my-node-app2 && docker rm my-node-app2
docker run -d -p 3000:3000 --net node-app_default  -e TOKEN_SECRET=VAL --name my-node-app my-node-app
docker run -d -p 3002:3000 --net node-app_default  -e TOKEN_SECRET=VAL --name my-node-app2 my-node-app

