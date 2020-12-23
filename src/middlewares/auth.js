const jwt = require('jsonwebtoken')
const User = require('../models/user')
const auth = async(req, res, next) => {
    try{
        console.log("Auth Logic")
        const secret = process.env.TOKEN_SECRET
        const token = req.header('Authorization').replace('Bearer ', '')
        const decodedToken = jwt.verify(token, secret)
        console.log("Token:", decodedToken)
        const user = await User.findOne({_id: decodedToken._id, 'tokens.token': token})
        if(!user){
            throw new Error("User not found")
        }
        console.log(user)
        req.user = user
        next()
    }catch(e) {
        res.status(401).send({error: 'Please authenticate'})
    }
    
    //next()
}

module.exports = auth