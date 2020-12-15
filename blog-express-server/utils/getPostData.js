// 解析 post 数据
const getPostData = (req) => {
    return new Promise((resolve, reject) => {
        if(req.method !== 'POST') {
            resolve({})
            return
        }

        if(req.headers['content-type'] !== 'application/json') {
            resolve({})
            return
        }

        let postData = ''
        req.on('data', chunk => {
            postData += chunk.toString()
        })

        req.on('end', () => {
            if(!postData) {
                resolve({})
                return
            }

            resolve(JSON.parse(postData))
        })
    })
}

module.exports = getPostData