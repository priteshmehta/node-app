// Redis caches
const redis = require('redis')

class redisClient {
    constructor() {
        console.log("REDIS:", process.env.REDIS_SERVER)
        this.client = redis.createClient({host: process.env.REDIS_SERVER, port:6379})
        this.client.on('error', (e) => {
            console.log("Error: ", e)
        })
    }
     //stats:appStats:requestCounter
     //increment cache key value
    incrValue(key) {
        this.client.get(key, (error, result) => {
            if(result) {
                this.client.set(key, String(Number(result)+1))
            } else {
                console.log("Key doesn't existing in the cache", error)
                this.client.set(key, 1)
            }
        })
    }
    // async getValue(key, cb) {
    //     this.client.get(key, (error, result) => {
    //     if(result) 
    //         return cb(undefined, result)
    //     else 
    //         cb("key not found", undefined)
    //     })
    // }
}

// No further commands will be processed
//client.end(true);

module.exports = new redisClient