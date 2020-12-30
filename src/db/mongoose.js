const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/task-manager-api', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true 
})


// const me = User({
//     name: "Pritesh5",
//     email: "pritesh2@example.com",
//     password: "PAssword"
// })

// me.save().then( () => {
//     console.log(me)
// }).catch( (error) => {
//     console.log("Error", error)
// })    

// const task = Task({
//     name: "Task1",
//     description: "This is task1",
//     isCompleted: false  
// })

// task.save().then(()=> {
//     console.log("task saved successfully")
// }).catch((error) => {
//     console.log("Error", error)
// })

module.exports = mongoose