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

hb.handlebars.registerHelper('gte', function (a, b) {
  return a >= b;
})

hb.handlebars.registerHelper('gt', function (a, b) {
  return a > b;
})

hb.handlebars.registerHelper('times', function(n, block) {
  var accum = '';
  for(var i = 0; i < parseInt(n); i++){
    accum += '<i class="fa-solid mt-1 fa-star me-1"></i>'
  }
  function isFloat(n){
    return Number(n) === n && n % 1 !== 0
  }
  if(isFloat(n)){
    accum += '<i class="fa-solid me-1 mt-1 fa-star-half-stroke"></i>'
    i++
  }
  while(i<5){
    accum += '<i class="fa-regular mt-1 fa-star me-1"></i>'
    i++
  }

  return accum;
});

app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: __dirname + '/public/temp'
}))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('hbs', hbs.engine({ extname: 'hbs', defaultLayout: 'layout', layoutsDir: __dirname + '/views/layout/', partialsDir: __dirname + '/views/partials/' }))

app.use(session({ secret: "key", saveUninitialized: true, resave: true, cookie: { maxAge: 24 * 60 * 60000 } }))
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
  console.log(err)
  const route = (req.url).split("/")[1]
  if(route =='admin'){
    req.session.ad= true
  }
  else{
    req.session.ad = null
  } 
  const ad = req.session.ad
  res.render('error',{ad});
});

module.exports = app;
