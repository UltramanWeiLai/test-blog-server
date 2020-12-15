var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const session = require('express-session')
const redisClient = require('./db/redis')
const RedisStore = require('connect-redis')(session)

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const blogRouter = require('./routes/blog')

var app = express();


// const logFileName = path.join(__dirname, 'logs', 'access.log')
// const writeStream = fs.createWriteStream(logFileName)
app.use(logger('dev', {
  stream: process.stdout // 接受一个写入流
  // stream: writeStream // 接受一个写入流
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const sessionStore = new RedisStore({
  client: redisClient
})

app.use(session({
  secret: 'WJiol#10086_', // 秘钥类的东西
  cookie: {
    // path: '/', // 默认配置
    // httpOnly: true, // 默认配置
    maxAge: 24 * 60 * 60 * 1000
  },
  store: sessionStore
}))

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/blog', blogRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
