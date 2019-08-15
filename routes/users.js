var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var passport = require('passport');

// Load usermodel containing users data schema

require('../models/users');
var User = mongoose.model('users');

// Users login Route
router.get('/login' , (req,res) => {
  res.render('users/login');
})

// Users Register Route
router.get('/register' , (req,res) => {
 res.render('users/register');
})

// Register form post
router.post('/register',(req,res) => {
  let errors = []
  if(req.body.password != req.body.password2){
    errors.push({text :'Password do not Match Buddy !!'})
  }

  if(req.body.password.length < 4){
    errors.push({text :'Password must be atleast 4 characters'})
  }
  if(errors.length > 0){
    res.render('users/register' , {
      errors : errors,
      firstName : req.body.firstName,
      secondName : req.body.secondName,
      email: req.body.email,
      password : req.body.password,
      password2 : req.body.password2

    });
  }else {
    User.findOne({email: req.body.email})
      .then(user => {
        if(user){
          req.flash('error_msg', 'Email already regsitered');
          res.redirect('/users/register');
        } else {
          const newUser = new User({
            firstName : req.body.firstName,
            secondName : req.body.secondName,
            email: req.body.email,
            password : req.body.password,
            password2 : req.body.password2
          });
          
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if(err) throw err;
              newUser.password = hash;
              newUser.save()
                .then(user => {
                  req.flash('succes_msg', 'You are now registered and can log in');
                  res.redirect('/users/login');
                })
                .catch(err => {
                  console.log(err);
                  return;
                });
            });
          });

      }
    });
   
  }
});


module.exports = router;

