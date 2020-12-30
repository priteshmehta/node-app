const express = require('express')
var sys = require('sys');

const slackRouter = express.Router()

//Receive message from slack channel #app-message
slackRouter.post("/slack/hook", (req, res) => {
    //slack app - PriteshTestApp
    console.log(req.body) // received slack message
    res.status(200).end() // Responding is important
})

//Send message to slack channel #app-message
slackRouter.post("/slack", (req, res) => {
    console.log(req.body)
    //payload : {"text":"Hello, World!"}
    //https://hooks.slack.com/services/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
    res.status(200).end() // Responding is important
  })

  module.exports = slackRouter