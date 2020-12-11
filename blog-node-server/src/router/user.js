const { userLogin } = require('../controller/user')
const { SuccessModel, ErrorModel } = require('../modal/res-model')
const { set } = require('../db/redis')

const handleUserRouter = (req, res) => {
    const method = req.method
    const { path } = req

    // 登录
    if(method === 'POST' && path === '/api/user/login') {
        const { username, password } = req.body
        const result = userLogin(username, password)

        return result.then(userData => {
            if(userData.username) {
                // 设置 session
                req.session.username = userData.username
                req.session.realname = userData.realname

                set(req.sessionId, req.session)

                return new SuccessModel(userData)
            } else {
                return new ErrorModel('登录失败')
            }
        })
    }
}

module.exports = handleUserRouter
