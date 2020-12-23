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

const express = require('express')
const path = require('path')
const userRouter = require('./routers/userRouter')
const taskRouter = require('./routers/taskRouter')
const{ healthRouter, appStats } = require('./routers/healthRouter')

//middleware
const auth = require('./middlewares/auth')
const rateLimit = require('./middlewares/rateLimiter')

const app = express()
const port = process.env.PORT || 3000
const isMaitenanceMode = process.env.Maitenance || 0
app.use(express.json())

app.use(rateLimit)
//middleware
app.use((req, res, next) => {
    console.log(`Requst method:${req.method}, path: ${req.path}, Headers:${JSON.stringify(req.headers)}`)
    appStats.requestCounter+=1
    const allowedVerbs = ['GET', 'POST', 'PATCH', 'DELETE']
    if(!allowedVerbs.includes(req.method)) {
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

app.use(userRouter)
app.use(taskRouter)
app.use(healthRouter)

app.get('/', (req, res) => {
  res.send('This is app1')
})

app.get('/location', (req, res) => {
    res.sendFile(path.join(__dirname,'html/location.html'))
})

app.listen(port, ()=> {
    console.log("express app is running on port", port)
})

// Remove the error.log file every twenty-first day of the month.
// const cron = require('node-cron')
// cron.schedule('* * * * *', function() {
//     console.log('---------------------');
//     console.log('Running Cron Job every minuts');
//   });
  