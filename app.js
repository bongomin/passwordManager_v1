var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var hbs = require('express-handlebars');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var methodOverride = require('method-override');
var flash = require('connect-flash');
var session = require('express-session');

// Load helper to protect routes 
const {ensureAuthenticated} = require('./helpers/auth');




var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var addRouter = require('./routes/add');
var aboutRouter = require('./routes/about');
var useRouter = require('./routes/use')

var app = express();

// Load routes
var usersRouter = require('./routes/users')

// Passport Config model Loaded
require('./config/passport')(passport);

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
var Password = mongoose.model('passwords');



// date middleware
app.use((req, res, next) => {
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
  partialsDir: [
    //  path to your partials
    path.join(__dirname, 'views/partials'),
  ]
}));

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// methodOverride middleawre used in put requests

app.use(methodOverride('_method'))

// express session middle ware
app.use(session({
  secret: 'Secret',
  resave: true,
  saveUninitialized: true,
}));
// passport middleware
app.use(passport.initialize());
app.use(passport.session());


// flash middleware
app.use(flash());

// Global Variables for flash Messages
app.use(function(req,res,next){
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;


  next();
})



app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/index', indexRouter);
app.use('/', usersRouter);
app.use('/users', usersRouter);
app.use('/add', addRouter);
app.use('/use', useRouter);
app.use('/about', aboutRouter);

app.get('/add',ensureAuthenticated,(req,res) =>{
  res.render('add');
})


// add password form
app.get('/passwords/add',ensureAuthenticated, (req, res) => {
  res.render('/');
})
//fetching data from db to the edit fields password
app.get('/passwords/edit/:id', (req, res) => {
  Password.findOne({
    _id: req.params.id
  })
    .then(password => {
      res.render('passwords/edit', {
        password: password
      });
    })
})

//Password /  password Page
app.get('/passwords',ensureAuthenticated, (req, res) => {
  Password.find({})
    .sort({ date: 'desc' })
    .then(passwords => {
      res.render('passwords/index', {
        passwords: passwords
      });
    });
});




//  Add process form
app.post('/passwords', (req, res) => {
  let errors = [];
  if (!req.body.systemName) {
    errors.push({ text: 'please insert system Name' });
  }
  if (!req.body.userName) {
    errors.push({ text: 'please insert User Name' });
  }
  if (!req.body.passWord) {
    errors.push({ text: 'please insert Password' });
  }

  if (errors.length > 0) {
    res.render('home', {
      errors: errors,
      systemName: req.body.systemName,
      userName: req.body.userName,
      passWord: req.body.passWord
    });
  } else {
    const newUser = {
      systemName: req.body.systemName,
      userName: req.body.userName,
      passWord: req.body.passWord

    }
    new Password(newUser)
      .save()
      .then(password => {
        req.flash('success_msg' , "You have added system password info to the system ")
        res.redirect('/passwords');

      })
  }
});

// Edit form process / request /put request

app.put('/passwords/:id', (req, res) => {
  Password.findOne({
    _id: req.params.id
  })
    .then(password => {
      // getting new password updated
      password.systemName = req.body.systemName;
      password.userName = req.body.userName;
      password.passWord = req.body.passWord;
      password.save()
        .then(password => {
          req.flash('success_msg' , "You have SuccessFully Edited the system info ")

          res.redirect('/passwords')
        });
    });
});


// Delete Passwords /delete requests
app.delete('/passwords/:id', (req, res) => {
  Password.remove({ _id: req.params.id })
    .then(() => {
      req.flash('success_msg' , "You have SuccessFully Deleted The System's Password Informations")
      res.redirect('/passwords');
    });
});


// use Routes

app.use('/users',usersRouter);



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
