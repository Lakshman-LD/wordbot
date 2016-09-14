var express = require('express');
var router = express.Router();

/* GET home page. */
router.post('/', function(req, res, next) {
  console.log("printing request object");
  console.log("Body is");
  console.log(req.body);
  console.log(req.body.id);
  console.log(req.body.contentType);
  console.log(req.body.text);
  res.send(200);
});

module.exports = router;
