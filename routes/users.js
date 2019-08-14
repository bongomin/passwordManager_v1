var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

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
      password2 :req.body.password2

    });
  }else{
    res.send('passed');

  }
})


module.exports = router;

