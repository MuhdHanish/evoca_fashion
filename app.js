const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan')
const hbs = require('express-handlebars')
const db = require('./config/connection')
const session = require('express-session')
const fileUpload = require('express-fileupload')

const userRouter = require('./routes/index');
const adminRouter = require('./routes/admin');

const app = express();

const hb = hbs.create({})
hb.handlebars.registerHelper('eq', function (a, b) {
  return a == b;
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('hbs', hbs.engine({ extname: 'hbs', defaultLayout: 'layout', layoutsDir: __dirname + '/views/layout/', partialsDir: __dirname + '/views/partials/' }))

app.use(fileUpload())

app.use(session({ secret: "key",saveUninitialized: true, resave: true,  cookie: { maxAge: 60000 * 60 } }))
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', userRouter);
app.use('/admin', adminRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
