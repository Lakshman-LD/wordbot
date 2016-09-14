var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log("prinitng request object");
  console.log(req);
  res.send(200);
});

module.exports = router;
