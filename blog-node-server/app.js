const querystring = require('querystring')

const blogRouter = require('./src/router/blog')
const userRouter = require('./src/router/user')

const { access } = require('./src/utils/log')

const { get } = require('./src/db/redis')
const getPostData = require('./src/utils/getPostData')
const getCookieExpires = require('./src/utils/getCookieExpires')

const serverHandle = (req , res) => {
    // 记录 access log
    access(`${req.method} -- ${req.url} -- ${req.headers['user-agent']} -- ${Date.now()}`)

    // 设置返回格式 JSON
    res.setHeader('Content-type', 'application/json')

    // process.env.NODE_ENV
    const { url } = req
    req.path = url.split('?')[0]

    // 解析 query
    req.query = querystring.parse(url.split('?')[1])

    // 解析 cookie
    req.cookie = {}
    const cookie = req.headers.cookie || ''
    cookie.split(';').forEach(item => {
        if(item) {
            const data = item.split('=')
            req.cookie[data[0].trim()] = data[1].trim()
        }
    });

    // 解析 SESSION_DATA
    let needSetCookie = false
    const sessionId = req.sessionId = req.cookie.userid

    new Promise((resolve, reject) => {
        if(sessionId) {
            get(sessionId)
                .then(value => {
                    req.session = value ? value : {}
                    resolve()
                })
        } else {
            needSetCookie = true
            req.sessionId = `${Date.now()}_${Math.random()}`
            req.session = {}
            resolve()
        }
        
    })
    .then(() => {
        // 解析 postData
        getPostData(req)
            .then(postData => req.body = postData)
            .then(() => {
                // 处理 blog 路由
                const blogResult = blogRouter(req, res)
                if(blogResult) {
                    return blogResult.then(blogData => {
                        if(needSetCookie) {
                            res.setHeader('Set-Cookie', `userid=${req.sessionId}; path=/; httpOnly; expires=${getCookieExpires()}`)
                        }

                        return res.end(JSON.stringify(blogData))
                    })
                }

                // 处理 user 路由
                const userResult = userRouter(req, res)
                if(userResult) {
                    return userResult.then(userData => {
                        if(needSetCookie) {
                            res.setHeader('Set-Cookie', `userid=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`)
                        }

                        return res.end(JSON.stringify(userData))
                    })
                }

                // 未命中路由，返回404
                res.writeHead(404, { 'Content-type': 'text/plain' })
                res.write('404 Not Found\n')
                res.end()
            })
    }) 
}

module.exports = serverHandle
