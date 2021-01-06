FROM node:12

# Create app directory
WORKDIR /usr/src/app
RUN chmod 777 /usr/src/app

RUN groupadd -r priteshGrp && useradd -r -g priteshGrp pritesh
USER pritesh

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 3000
CMD [ "node", "src/index.js" ]