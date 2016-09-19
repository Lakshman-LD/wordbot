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
	console.log("Finding definition of " + word);
	request(dictionary_main + word, callback);
}, 
getDefintionFromDictResponse = function(body) {
	var bodyJson = JSON.parse(body);
	if(bodyJson.results && bodyJson.results.length > 0 && bodyJson.results[0].senses && bodyJson.results[0].senses.length > 0) {
		console.log("y5");
		var sense = bodyJson.results[0].senses[0], response;
		if(sense.definition && sense.definition.length > 0) {
			console.log("y6");
			response = string_definition + sense.definition[0];
		}
		if(sense.examples && sense.examples.length > 0 && sense.examples[0].text) {
			console.log("y7");
			response +=  string_example + sense.examples[0].text;
		}
		return response;
	}
},
sendResponseMessage = function(message, to) {
	var myJSONObject = {};
	myJSONObject.to = to;
	myJSONObject.toChannel = "1383378250";
	myJSONObject.eventType = "138311608800106203";
	var content = {};
	//set content here
	request({
	    url: "http://josiahchoi.com/myjson",
	    method: "POST",
	    json: true,
	    headers: {
	        "content-type": "application/json; charset=UTF-8",
	        "X-Line-ChannelID": "1480732716",
			"X-Line-ChannelSecret": "75ba882401bb4c4ae52123e7de5a77b1",
			"X-Line-Trusted-User-With-ACL": "u146be2a42ebbcbf77ba0e172bf54f961"
	    },
	    body: myJSONObject
	}, function (error, response, body){
	    console.log(response);
	});
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

  console.log("y1");
  console.log(req.body);
  if(req.body.result) {
  	console.log("y2");
  	var result = req.body.result;
  	if(result.length > 0) {
  		console.log("y3");
  		requestJson = result[0];
  		console.log("result" + requestJson);
  	}
  } else {
  	console.log("No result param in line's request json");
  }

  // get query text typed by user
  if(requestJson.content &&  requestJson.content.text) {
  	console.log("y4");
	querytxt = requestJson.content.text;
	console.log(querytxt);
  }
 // Initialize response to error
 if(querytxt) {
 	var query = querytxt.split(" ");
 	if(query.length > 1) {
 		if (query[0] === "define") {
 			getDefinition(querytxt.substring(querytxt.indexOf(" ") + 1, querytxt.length), function(error, response, body){
				var def = getDefintionFromDictResponse(body);
				console.log(def);
				if(def) {
					res.send("Defintion");
				} else {
					res.send(error_response);
				}
			});
 		}
 	} else {
 		res.send(error_response);
 	}
 } else {
 	res.send(error_response);
 }
});
module.exports = router;
