const redis = require('redis')
const { REDIS_CONF } = require('../conf/db')

const { port, host } = REDIS_CONF

// 创建客户端
const redisClient = redis.createClient(port, host)
redisClient.on('error', err => {
    console.error(err)
})

function set(key, value) {
    if(typeof value === 'object') {
        value = JSON.stringify(value)
    }
    redisClient.set(key, value, redis.print)
}

function get(key) {
    return new Promise((resolve, reject) => {
        redisClient.get(key, (err, val) => {
            if(err) {
                reject(err)
                return 
            }

            if(val === null) {
                resolve(null)
                return 
            }

            try {
                resolve(JSON.parse(val))
            } catch (error) {
                resolve(val)
            }
        })
    })
}

module.exports = {
    set,
    get
}