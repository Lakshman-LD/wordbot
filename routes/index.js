var express = require('express'),
request =  require('request'),
router = express.Router(),
dictionary_main = "https://api.pearson.com/v2/dictionaries/ldoce5/entries?apikey=sMtEeSSleFLGO4ijUT8ATAwHfuPEJYLg&limit=1&part_of_speech=noun&headword=",
string_response = "I'm afraid I don't understand. I'm sorry!",
string_manywords = "My Bad!. I am still young. I can only define single words for now.",
string_definition = "Defintion:\n",
string_example = "\nExample:\n",
getDefinition = function(word, callback) {
	if(word.split(" ").length > 1) {
		return error_manywords;
	}

	request(dictionary_main + word, callback);
}, 
getDefintionFromDictResponse = function(body) {
	body = JSON.parse(body);
	if(body.results && body.results.length > 0 && body.results[0].senses && body.results[0].senses.length > 0) {
		var sense = body.results[0].senses[0], response;
		if(sense.definition && sense.definition.length > 0) {
			response = string_definition + sense.definition[0];
		}
		if(sense.examples && sense.examples.length > 0 && sense.examples[0].text) {
			response +=  string_example + sense.examples[0].text;
		}
		return response;
	}
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
 if(querytxt) {
 	var query = querytxt.split(" ");
 	if(query.length > 1) {
 		if (query[0] === "define") {
 			getDefinition(querytxt.substring(querytxt.indexOf(" ") + 1, querytxt.length), function(error, response, body){
				var def = getDefintionFromDictResponse(body);
				if(def) {
					res.send(def);
				} else {
					res.send(error_response);
				}
			});
 		}
 	} else {
 		res.send(error_response);
 	}
 }
});
module.exports = router;
