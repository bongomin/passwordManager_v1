var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');


require('../models/Password');
const Password = mongoose.model('passwords');

/* GET home page. */
router.get('/add', function (req, res) {
  res.render("add");
});


module.exports = router;
