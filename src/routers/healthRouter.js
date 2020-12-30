const express = require('express')

const healthRouter = express.Router()
const redisClient = require('../cache/redisClient')
const appStats = {requestCounter:0}

const getAppStats = (appStats) => {
        redisClient.client.keys("appStats:*", (error, keys)=> {
        if(error){
            throw new Error("Redis error")
        }
        console.log("Total keys: ", keys)
        keys.forEach((key) => {
            redisClient.client.get(key, (err, value) => { 
                console.log(key, value)
                appStats[key] = value
            })
        })
    })
}

healthRouter.get('/stats',  async (req, res) => {
    console.log("Req Ip", req.ip)
    const appStats1 = {}
    getAppStats(appStats1)
    console.log("DONE.....",appStats1)

    redisClient.client.get('appStats:requestCounter', (error, result) => {
        if(!result) {
            res.status(200).json({})
        }
        res.status(200).json({totalRequests: result, app1: appStats})
    })    
})

healthRouter.get('/ping', (req, res) => {
    res.send("pong")
})

module.exports = { healthRouter, appStats, getAppStats}