var express = require('express'),
request =  require('request'),
router = express.Router(),
dictionary_main = "https://api.pearson.com/v2/dictionaries/ldoce5/entries?apikey=sMtEeSSleFLGO4ijUT8ATAwHfuPEJYLg&headword=",
error_response = "I'm afraid I don't understand. I'm sorry!",
error_manywords = "My Bad!. I am still young. I can only define single words for now.",

getDefinition = function(word, callback) {
	if(word.split(" ").length > 1) {
		return error_manywords;
	}

	request(dictionary_main + word, callback);
};

/* GET home page. */
router.post('/line', function(req, res, next) {
	// Below comments to be deleted after testing first branch merge to main
  // console.log("printing request object");
  // console.log("Body of request is ");
  // console.log(req.body.result);
  // console.log("Request is ");
  // console.log(req.body.result[0]);

  var requestJson, querytext;
  // Check if Line Request has result json object
  if(req.body.result) {
  	requestJson = JSON.parse(req.body.result);
  }

  // get query text typed by user
  if(requestJson.content &&  requestJson.content.text) {
	querytxt = requestJson.content.text;
  }
 // Initialize response to error
 response = error_response;
 if(querytxt) {
 	var query = querytxt.split(" ");
 	if(query.length > 1) {
 		if (query[0] === "define") {
 			response = getDefinition(querytxt.substring(querytxt.indexOf(" ") + 1, querytxt.length), function(error, response, body){
				console.log(body);
			});
 		}
 	}
 }
 res.send(response);
});
module.exports = router;
