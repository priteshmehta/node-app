# node-app

## Setup 

### create prod.env with following env variables.
PORT=
DB_SERVER=
DB_PORT=
TOKEN_SECRET=
SENDGRID_API_KEY=

### spin up application
run ./bootstrap.sh

### To Make sure all services are up and running
docker ps

### deploy new code
run ./deploy_app.sh

### clean up
run ./nuke.sh