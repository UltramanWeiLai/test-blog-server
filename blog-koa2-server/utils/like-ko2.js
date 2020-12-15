const http = require('http')

function compose(middlewareList) {
    return function(ctx) {
        function dispatch(i) {
            const fn = middlewareList[i]
            try {
                return Promise.resolve(fn(ctx, dispatch.bind(null, i + 1)))
            } catch {
                return Promise.reject('err')
            }
        }
        return dispatch(0)
    }
}

class LikeKoa2 {
    constructor() {
        this.middlewareList = []
    }

    use(fn) {
        this.middlewareList.push(fn)
    }

    listen(...args) {
        const server = http.createServer(this.callback())
        server.listen(...args)
    }

    callback() {
        const fn = compose(this.middlewareList)
        return (res, req) => {
            const ctx = createContext(req, res)
            return this.handleRequest(ctx, fn)
        }
    }

    createContext(req, res) {
        const ctx = {
            req, 
            res
        }

        return ctx
    }

    handleRequest(ctx, fn) {
        return fn(ctx)
    }
}