const mongoose = require('../db/mongoose')
const validator = require('validator')

const taskSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true,
        default: ''
    },
    isCompleted: {
        type: Boolean,
        default: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'User'
    }
},{
    timestamps: true
})

taskSchema.pre('save', async function(next) {
    console.log("mongoose middleware:: task enrichment before saving to db")
    next()
})
const Task  = mongoose.model('Task', taskSchema)

module.exports = Task