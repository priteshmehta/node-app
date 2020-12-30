// http response code cheat sheet
//https://httpstatuses.com/
//1xx informationals
//200 ok - GET, 201 - created (POST), 202 - accepted, 203 - partial information received (GET) 204 - Cotent moved (DELETE)
//3xx redirect
//400 - Bad Req, 401 - Unauthorised, 403 - forbidden, 404 - not found, 402 Payment required
//500 - Server error, 502 bad gatewat, 504 Gateway timeout, 501 - Not supported

//Scalling nodejs aapp 
// - PM2 as process manager to spawn and managet each core by express process
// - load balancer (ELB or Nginx)

// https://sequelize.org/ - ORM for SQL server - 1
// https://github.com/coresmart/persistencejs ORM for SQL server - 1

const express = require('express')
const path = require('path')
const hbs = require('hbs')
const swaggerUi = require('swagger-ui-express');
//const swaggerDocument = require('./swagger.json');
const userRouter = require('./routers/userRouter')
const taskRouter = require('./routers/taskRouter')
const slackRouter = require('./routers/slackRouter')
const{ healthRouter, appStats, getAppStats} = require('./routers/healthRouter')
const logger = require('./utils/logger')
const {sendStats} = require('./email/account')

//middleware
const auth = require('./middlewares/auth')
const rateLimit = require('./middlewares/rateLimiter')
const redisClient = require('./cache/redisClient')

const app = express()
const port = process.env.PORT || 3000
const isMaitenanceMode = process.env.Maitenance || 0
app.use(express.json())
app.use(rateLimit)
app.set('view engine', 'hbs')
app.use(express.static(path.join(__dirname, 'html')))

//middleware
app.use((req, res, next) => {
    const { ip, protocol, method, url, headers } = req;
    const userAgent = headers['user-agent']
    logger.info({ip, protocol, method, url, userAgent})
    appStats.requestCounter+=1
    redisClient.incrValue('appStats:requestCounter')
    redisClient.incrValue('appStats:'+req.method + req.path)    
    const allowedVerbs = ['GET', 'POST', 'PATCH', 'DELETE']
    if(!allowedVerbs.includes(req.method)) {
        logger.info(`Not Supported HTTP verb. Webservice supports: ${allowedVerbs.toString()}`)
        res.send("Not Supported HTTP verb. Webservice supports: "+allowedVerbs.toString())
    }
    next()
})

//App in maintance mode
app.use((req, res, next) => {
    if(isMaitenanceMode) {
        res.status(503).send("App is under maitenance. Please try again leter")
    }
    next()
})

//docs
//app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//https://nodesource.com/blog/nine-security-tips-to-keep-express-from-getting-pwned
const helmet = require('helmet');
app.use(helmet());

app.use(userRouter)
app.use(taskRouter)
app.use(healthRouter)
app.use(slackRouter)

//send HTML files
// app.get('/location', (req, res) => {
//     logger.info("serving location.html")
// 	res.render('location')
// })

app.get('/file', (req, res) => {
    logger.info("serving fileupload.html")
	res.sendFile(path.join(__dirname,'html/fileupload.html'))
})

app.listen(port, ()=> {
    logger.info(`express app is running on port: ${port}`)
})

// runs 8am everyday and send app stats.
const cron = require('node-cron')
cron.schedule('0 8 * * *', function() {
    try {
        logger.info('--------Cron scheduler Start---------------------')
        // Todo send email
        //getAppStats(appStats)
        sendStats("Daily Stats :: TBD")
        logger.info('--------Cron scheduler Ends---------------------')
    } catch(e) {
        logger.error(e.message)
    }
});
  