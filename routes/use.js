var express = require('express');
var router = express.Router();
const { ensureAuthenticated } = require('../helpers/auth');




/* GET home page. */
router.get('/',ensureAuthenticated, function (req, res) {
  res.render("use");
});

module.exports = router;
