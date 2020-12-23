const express = require('express')

const healthRouter = express.Router()
const appStats = {requestCounter:0}

healthRouter.get('/stats', (req, res) => {
    res.json(appStats)
})

healthRouter.get('/ping', (req, res) => {
    res.send("pong")
})

module.exports = { healthRouter, appStats }