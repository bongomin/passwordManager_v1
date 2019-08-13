var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var hbs = require('express-handlebars');
var  bodyParser = require('body-parser');
var mongoose = require('mongoose');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var homeRouter = require('./routes/home');
var aboutRouter = require('./routes/about');
var useRouter = require('./routes/use')

var app = express();

// map global promisies / get reed of worning
mongoose.Promise = global.Promise;
// connection to mongoose
mongoose.connect('mongodb://localhost/password-manager', {
  useNewUrlParser: true
  // useMongoClient: true
})
.then(() => console.log('MongoDB Connected...'))
.catch(err => console.log(err));


// Load Password Model
require('./models/Password');
const Password = mongoose.model('passwords');



// date middleware
app.use( (req,res,next) => {
  console.log(Date.now());
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

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


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


// add password form
app.get('/passwords/add' ,(req,res) => {
  res.render('/');
})
 //Editing password
app.get('/passwords/add' ,(req,res) => {
  res.render('/');
})

//Password /  password Page
app.get('/passwords', (req, res) => {
  Password.find({})
    .sort({date:'desc'})
    .then(passwords => {
      res.render('passwords/index', {
        passwords:passwords
      });
    });
});

  


// process form
app.post('/passwords', (req,res) => {
  let errors = [];
  if(!req.body.systemName){
    errors.push({text : 'please insert system Name'});
  }
  if(!req.body.userName){
    errors.push({text : 'please insert User Name'});
  }
  if(!req.body.passWord){
    errors.push({text : 'please insert Password'});
  }
 
  if(errors.length >0){
    res.render('home' ,{
      errors : errors,
      systemName : req.body.systemName,
      userName : req.body.userName,
      passWord : req.body.passWord
    });
  } else {
    const newUser ={
      systemName : req.body.systemName,
      userName : req.body.userName,
      passWord : req.body.passWord

    }
    new Password(newUser)
    .save()
    .then( password => {
      res.redirect('/passwords');

    })
  }
});

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
