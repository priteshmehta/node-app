const mongoose = require('../db/mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required:  [true, 'User name is required'],
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)){
                throw new Error("email is invalid")
            }
        }
    },
    password: {
        type: String,
        required: [true, "It is manadatory value"],
        trim: true,
        min: [6, "Password should be greater than 6"],
        validate(value){
            if(value.toLowerCase() == 'password') {
                throw new Error("Password string is not allowed as passowrd")
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if(value < 0){
                throw new Error("Age should be a positive number")
            }
        }
    },
    isActive: {
        type: Boolean,
        default: true
    },
    tokens: [{
        token: {
            type: String,
            require: true
        }
    }],
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true
})

userSchema.virtual('task', {
    ref: 'Tasks',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.statics.findUserByEmail = async function(email, password){
    const user = await this.findOne({email: email})
    if (!user) {
        throw new Error("User not found. Login failed")
    }
    console.log("hashed password", user.password)
    const isMatch = await bcrypt.compare(password, user.password)
    return user
}

userSchema.methods.generateAuthToken = async function() {
    const secret = process.env.TOKEN_SECRET
    const token = jwt.sign({_id: this._id.toString()},secret, {expiresIn: '30 day'})
    this.tokens = this.tokens.concat({token: token})
    await this.save()
    return token
}

userSchema.methods.getPublicProfile = function() {
    return {_id: this._id.toString(), email: this.email, name: this.name, age: this.age}
}


userSchema.pre('save', async function(next) {
    console.log("Mongoose middleware:: update user data before saving it.")
    if (this.isModified('password')) {
        console.log("Hashing password")
        this.password = await bcrypt.hash(this.password, 8)
    }
    next()
})

const User = mongoose.model('User', userSchema)


module.exports = User