const express = require('express')
const User = require('../models/user')
//middleware
const auth = require('../middlewares/auth')

const userRouter = new express.Router()

userRouter.get('/users/me', auth, (req, res) => {
    try {
        const user = req.user
        res.send(user.getPublicProfile())
    } catch(e) {
        res.status(500)
        res.send(e.message)
    }
})

userRouter.get('/users', auth, (req, res) => {
    User.find({isActive: true}).then((users) => {
        console.log(users)
        res.status(200)
        res.send(users)
    }).catch((e) => {
        console.log(e)
        res.status(500).send()  
    })
})

userRouter.post('/users', async (req, res) => {
    try {
        //console.log(req.body)
        //console.log("http request:" +req.method+" "+req.originalUrl);
        const user = new User(req.body)
        await user.save()
        const token = user.generateAuthToken()
        res.status(201).send(user.getPublicProfile())
    } catch(e) {
        res.status(400)
        res.json({ error:{msg: e.message}})
    }
})

userRouter.patch('/users/me', auth, async (req, res) => {
    updates = Object.keys(req.body)
    allowedUpdate = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((key)=>{
        allowedUpdate.includes(key)
    })
    if(!isValidOperation) {
        res.status(400).send({error: "Invalid payload"})
    }
    try {
        const data = req.body
        console.log(data)
        console.log(req.user._id)
        const user = await User.findByIdAndUpdate(req.user._id, data, {new: true, runValidators: true})
        res.send(user)
    } catch(e) {
        console.log(e)
        res.status(500)
        res.send(e.message)
    }
})

userRouter.post('/users/login', async (req, res) => {
    try {
        const user = await User.findUserByEmail(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.status(200).send({ user: user.getPublicProfile(), token:token})
    }catch(e) {
        console.log(e)
        res.status(400)
        res.json({ error:{msg: e.message}})
    }
})

userRouter.post('/users/logout', auth, async(req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token != req.token
        })
        await req.user.save()
        res.send("Logout successfully")
    }catch(e) {
        res.status(500)
        res.send(e.message)
    }
})

userRouter.post('/users/logoutAll', auth, async(req, res) => {
    try {
        req.user.tokens = [{}]
        await req.user.save()
        res.status(200).send("Logout from all devices")
    } catch(e) {
        res.status(500)
        res.send(e.message)
    }
})

module.exports = userRouter