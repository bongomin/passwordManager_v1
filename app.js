var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var hbs = require('express-handlebars');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var homeRouter = require('./routes/home');
var aboutRouter = require('./routes/about');
var useRouter = require('./routes/use')

var app = express();

// date middleware
app.use( (req,res,next) => {
  console.log(Date.now());
  req.name = 'danny Daniels';
  next();
});

// view engine setup  // handle bars templating engine middleware
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// middleware for locating the partial file
app.engine('hbs', hbs({
  extname: 'hbs', 
  defaultLayout: 'layout', 
  layoutsDir: path.join(__dirname, 'views'),
  partialsDir  : [
      //  path to your partials
      path.join(__dirname, 'views/partials'),
  ]
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/index', indexRouter);
app.use('/users', usersRouter);
app.use('/', homeRouter);
app.use('/use',useRouter);
app.use('/about',aboutRouter);

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
