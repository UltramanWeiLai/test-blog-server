var express = require('express');
var router = express.Router();

const { userLogin } = require('../controller/user')
const { SuccessModel, ErrorModel } = require('../modal/res-model')
const { set } = require('../db/redis')

router.post('/login', function(req, res, next) {
    const { username, password } = req.body
    const result = userLogin(username, password)

    return result.then(userData => {
        if(userData.username) {
            // 设置 session
            req.session.username = userData.username
            req.session.realname = userData.realname

            set(req.sessionId, req.session)

            res.json(new SuccessModel(userData))
        } else {
            res.json(new ErrorModel('登录失败'))
        }
    })
})

module.exports = router;
