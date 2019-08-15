var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

// Load User Modal
var User = mongoose.model('users');

module.exports = (passport) =>{
    passport.use(new LocalStrategy({usernameField : 'email'},(email,password ,done)=>{
        console.log(password);

    }))

}
