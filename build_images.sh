docker build -t my-node-app .
cd nginx
docker build -t nginx -f Dockerfile .


# 2 instances of same app
#docker run -p 3000:3000 --network=my-net --name my-node-app -d my-node-app
#docker run -p 3001:3000 -p:8080:8080 --network=my-net --name my-node-app2 -d my-node-app
#docker run --net=my-net -p 80:80 --name nginx -d nginx

#docker-compose up --build
# Nginx
#docker run -p 80:80 --net=host -v /Users/pmehta/mygithub/node-app/nginx/config/nginx:/etc/nginx --name nginx -d nginx