const crypto = require('crypto')

// 秘钥
const SECRET_KEY = 'WJiol_8776#'

// md5
const md5 = (content) => {
    let md5 = crypto.createHash('md5')
    return md5.update(content).digest('hex')
}

// 加密
const genPassword = (password) => {
    const str = `password=${password}&key=${SECRET_KEY}`
    return md5(str)
}

module.exports = {
    genPassword
}
