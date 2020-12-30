const express = require('express')
const Task = require('../models/task')
const auth = require('../middlewares/auth')
const logger = require('../utils/logger')

const taskRouter = new express.Router()

taskRouter.get('/tasks', auth, async (req, res) => {
    try {
        const tasks = await Task.find({owner: req.user._id})
        if (!tasks) {
            res.status(404).send("task not found")
        }
        res.send(tasks)
    } catch(e) {
        console.log(e)
        res.status(500).send()
    }
})

// Get /internal/tasks?completed=true
// Get /internal/tasks?limit=10&skip=1
taskRouter.get('/internal/tasks', async (req, res) => {
    searchObj = {}
    logger.info({QueryParam: req.query})
    try {
        if(req.query.completed) {
            searchObj.isCompleted = req.query.completed === 'true'
        }
        const tasks = await Task.find(searchObj, null, { limit: parseInt(req.query.limit), skip: parseInt(req.query.skip)})
        res.send(tasks)
    } catch(e) {
        console.log(e)
        res.status(500).send()
    }
})

taskRouter.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id
    try {
        const tasks = await Task.findOne({ _id, owner: req.user._id })
        if (!tasks) {
            res.status(404).send("task not found")
        }
        res.send(tasks)
    } catch(e) {
        console.log(e)
        res.status(500).send()
    }
})

taskRouter.post('/tasks', auth, async (req, res) => {
    try {
        console.log("http request:" +req.method+" "+req.originalUrl);
        const task = new Task({
            ...req.body,
            owner: req.user._id
        })
        await task.save()
        res.status(201)
        res.send(task)
    }catch(e){
        res.status(500)
        res.send(e.message)
    }
})

taskRouter.patch('/tasks/:id', auth, async (req, res) => {
    try{
        const _id = req.params.id
        allowedUpdate = ['name', 'description']
        updates = Object.keys(req.body)
        const isValidPayload =  updates.every((key)=> allowedUpdate.includes(key))
        if (!isValidPayload){
            res.status(400).send({"error": "invalid data"})
        }
        const tasks = await Task.findOne({ _id, owner: req.user._id })
        if(!task) {
            res.status(400).send({"error": "invalid task id"})
        }
        const task = await Task.findByIdAndUpdate(_id, req.body, {new: true, runValidators: true})
        res.status(200).send(task)
    } catch(e) {
        res.status(500).send({error: e.message})
    }
})

module.exports = taskRouter