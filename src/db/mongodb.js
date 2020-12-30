//CRUD operation
const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient
const ObjectID = mongodb.ObjectID

const connnectionURL = 'mongodb://'+process.env.DB_SERVER+':'+process.env.DB_PORT
const database = 'task-manager'
const id = new ObjectID()
console.log("generatedId:" + id)

MongoClient.connect(connnectionURL, { useNewUrlParser: true}, (error, client) => {
    if(error){
        console.log('unable to connection to database')
        return
    } 
    console.log('connected!')
    const db = client.db(database)
    // Deleting document
    db.collection('tasks').deleteMany({
        completed: true
    }).then((result) => {
        console.log(result)
    }).catch((error)=> {
        console.log(error)
    })

})

//############## Sample code for Read and Insert data ###################

//Fetch task by id
// db.collection('tasks').findOne({_id: ObjectID("5f9b99b7cde948407a204a60")}, (error, data) => {
//     if(error){
//         return console.log("unable to find tasks data")
//     }
//     console.log(data)
// })
// //Fetch all non completed task
// db.collection('tasks').find({completed: false}).toArray((error, data) => {
//     if(error){
//         return console.log("unable to find tasks data")
//     }
//     console.log("******* Not completed task*******")
//     //console.log("Total not completes task + ",)
//     data.forEach( (task) => {
//         console.log(task.description)
//     })
// })

// Find Call 
    // db.collection('users').findOne({name: 'Pritesh1'}, (error, user) => {
    //     if(error){
    //         return console.log("unable to find any data")
    //     }
    //     console.log(user)
    // })
    // db.collection('users').find({name: 'Pritesh1'}).toArray((error, userData) => {
    //     console.log(userData)
    // })
    // const data = [{
    //     description: "learnging nodejs",
    //     completed: false
    // },
    // {
    //     description: "learning javascript",
    //     completed: true
    // }]
    // db.collection('tasks').insertMany(data, (error, result) => {
    //     if (error){
    //         return console.log('failed to intert tasks!')
    //     }
    //     console.log("Total documents inteserted: " + result.insertedCount)
    //     //console.log(result.ops)
    // })
    // console.log("Should print before inserting documents...")
    // db.collection('users').insertOne({
    //     name: "Pritesh1NewId",
    //     age: "35"
    // },(error, result) => {
    //     if (error){
    //         return console.log('failed to intert user!', error.code, error.errmsg)
    //     }
    //     console.log(result.ops)
    //     console.log(result.insertedCount)
    //     console.log(result.insertedId)
    // })