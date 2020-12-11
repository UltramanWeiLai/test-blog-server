const { getList, getDetail, newBlog, updateBlog, deleteBlog } = require('../controller/blog')
const { SuccessModel, ErrorModel } = require('../modal/res-model')
const { loginCheck } = require('../utils/loginCheck')

const handleBlogRouter = (req, res) => {
    const method = req.method
    const { path } = req
    const { id } = req.query

    // 获取博客列表
    if(method === 'GET' && path === '/api/blog/list') {
        const { author = '', keyword = '' } = req.query
        const result = getList(author, keyword)
        return result.then(listData => {
            return new SuccessModel(listData)
        })
    }

    // 获取博客详情
    if(method === 'GET' && path === '/api/blog/detail') {
        const result = getDetail(id)
        return result.then(detailData => {
            return new SuccessModel(detailData)
        })
    }

    // 新建一篇博客
    if(method === 'POST' && path === '/api/blog/new') {
        const loginCheckResult = loginCheck(req)
        if(loginCheckResult) {
            // 没有登录
            return loginCheckResult
        }

        req.body.author = req.session.username
        const result = newBlog(req.body)
        return result.then(data => {
            return new SuccessModel(data)
        })
    }

    // 更新一篇博客
    if(method === 'POST' && path === '/api/blog/update') {
        const loginCheckResult = loginCheck(req)
        if(loginCheckResult) {
            // 没有登录
            return loginCheckResult
        }

        const result = updateBlog(id, req.body)
        return result.then(data => {
            if(data) {
                return new SuccessModel(data)
            } else {
                new ErrorModel('更新失败')
            }
        })
    }

    // 删除一篇博客
    if(method === 'POST' && path === '/api/blog/delete') {
        const loginCheckResult = loginCheck(req)
        if(loginCheckResult) {
            // 没有登录
            return loginCheckResult
        }

        const result = deleteBlog(id, req.session.username)
        return result.then(data => {
            if(data) {
                return new SuccessModel(data)
            } else {
                return new ErrorModel('删除失败')
            }
        })
    }
}

module.exports = handleBlogRouter
