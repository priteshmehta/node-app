const express = require('express')
const Task = require('../models/task')
const auth = require('../middlewares/auth')

const taskRouter = new express.Router()

taskRouter.get('/tasks', auth, async (req, res) => {
    try {
        const tasks = await Task.find({})
        res.send(tasks)
    } catch(e) {
        console.log(e)
        res.status(500).send()
    }
})

taskRouter.post('/tasks', auth, async (req, res) => {
    try {
        console.log("http request:" +req.method+" "+req.originalUrl);
        const task = new Task(req.body)
        await task.save()
        res.status(201)
        res.send(task)
    }catch(e){
        res.status(500)
        res.send(e.message)
    }
})

module.exports = taskRouter