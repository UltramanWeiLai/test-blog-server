const router = require('koa-router')()

router.prefix('/api/blog')

router.get('/list', async (ctx, next) => {
    const query = ctx.query
    ctx.body = {
        errno: 0,
        query,
        data: ['xxx']
    }
})


module.exports = router
