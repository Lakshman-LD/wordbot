var express = require('express');
var router = express.Router();

/* GET home page. */
router.post('/', function(req, res, next) {
  console.log("printing request object");
  console.log("Body of request is ");
  console.log(req.body.result);
  console.log("Request is ");
  console.log(req.body.result[0]);
  res.send(200);
});

module.exports = router;
