const express = require('express')
const User = require('../models/user')
const multer = require('multer')
const sharp = require('sharp')
const ExifImage = require('exif').ExifImage

//middleware
const auth = require('../middlewares/auth')

//utility
const Util = require('../utils/util')
const logger = require('../utils/logger')
const {sendWelcomeEmail} = require('../email/account')

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
        logger.info(users)
        res.status(200)
        res.send(users)
    }).catch((e) => {
        logger.error(e)
        res.status(500).send()  
    })
})

userRouter.post('/users', async (req, res) => {
    try {
        logger.info({email: req.body.email, name: req.body.name})
        const user = new User(req.body)
        await user.save()
        const token = user.generateAuthToken()
        logger.info("Sending welcome email")
        sendWelcomeEmail(user.email, user.name)
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
        logger.info(data)
        const user = await User.findByIdAndUpdate(req.user._id, data, {new: true, runValidators: true})
        res.send(user)
    } catch(e) {
        logger.error(e)
        res.status(500)
        res.send(e.message)
    }
})

userRouter.post('/users/login', async (req, res) => {
    try {
        authToken = req.header('Authorization').replace('Basic ', '')
        let util = new Util;
        let userCred = util.atob(authToken)
        const [email, password] = userCred.split(":")
        const user = await User.findUserByEmail(email, password)
        const token = await user.generateAuthToken()
        res.setHeader('Set-Cookie', 'token='+token+'; HttpOnly');
        res.status(200).send({ user: user.getPublicProfile(), token:token})
    }catch(e) {
        logger.error(e)
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
        logger.error(e)
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

//Allowed jpeg and png to upload
const upload = multer({ 
    //dest: 'avatar/',
    fileSize: 5 * 1024 * 1024, // 2MB
    //file.originalfile.match(/*\.(jpg|png)/) - match file extension
    fileFilter: function (req, file, cb) {
        if (!['image/jpeg', 'image/png'].includes(file.mimetype)) {
            return cb(new Error('Wrong file type. Please updload jpg or png file'));
        }
        cb(undefined, true)
      }
    //  storage: myCustomStorage({
    //     destination: function (req, file, cb) {
    //       cb(null, '/var/www/uploads/' + file.originalname)
    //     }
    //   })
})

userRouter.post('/users/image', upload.single('file-upload'), async (req, res) => {
    try {
        new ExifImage({ image : req.file.buffer }, function (error, exifData) {
            if (error) {
                console.log('Error: '+error.message)
                res.status(500).send({error: error.message})
            }
            else {
                //console.log(exifData); // Do something with your data!
                res.send({image: exifData.image, exif: exifData.exif})
            }
        });
    } catch (error) {
        console.log('Error: ' + error.message);
        res.status(500).send()
    }
}, (error, req, res, next) => {
    res.status(400).send({error: error.message})
})

userRouter.post('/users/me/avatar', auth, upload.single('file-upload'), async (req, res) => {
    req.user.avatar = await sharp(req.file.buffer).png().toBuffer()
    await req.user.save()
    res.status(200).send(req.user)
    }, (error, req, res, next) => {
        res.status(400).send({error: error.message})
})

userRouter.delete('/users/me/avatar', auth, async (req, res) => {
    try {
        req.user.avatar = undefined
        await req.user.save()
        res.status(200).send("deleted succesfully")
    } catch(e) {
        res.status(500).send({error: e.message})
    }
})

userRouter.get('/users/me/avatar', auth, async (req, res) => {
    try {
        if (!req.user.avatar) {
            res.status(404).send({error: "image not found"})
        }
        res.set('content-type', 'image/png')
        res.send(req.user.avatar)
    }catch(e) {
        res.status(400).send()
    }
    
})

module.exports = userRouter