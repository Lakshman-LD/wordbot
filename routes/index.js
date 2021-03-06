var express = require('express'),
request =  require('request'),
router = express.Router(),
dictionary_main = "https://api.pearson.com/v2/dictionaries/ldoce5/entries?apikey=sMtEeSSleFLGO4ijUT8ATAwHfuPEJYLg&limit=1&part_of_speech=noun%2Cadjective%2Cverb&headword=",
line_sendmessage = "https://trialbot-api.line.me/v1/events",
string_channelid = "1480732716",
string_channelsecret = "75ba882401bb4c4ae52123e7de5a77b1",
string_channelmid = "u146be2a42ebbcbf77ba0e172bf54f961",
string_noresultparam = "No result param in line's request json",
string_nocontent = "Content, text or from field missing",
string_errorresponse = "I'm afraid I don't understand. I'm sorry!",
string_manywords = "My Bad!. I am still young. I can only define single words for now.",
string_absentword = "Oops! It seems my dictionary does not have that word.",
string_definition = "Defintion:\n",
string_example = "\nExample:\n",
getDefinition = function(word,replyJson, callback) {
	if(word.split(" ").length > 1) {
		return string_manywords;
	}
	console.log("Finding definition of " + word);
	request(dictionary_main + word, function(error, response, body) {
		var def = getDefintionFromDictResponse(body);
		//console.log(def);
		if(def) {
			replyJson.content.text = def;
			//console.log(JSON.stringify(replyJson));
			sendLineResponseMessage(replyJson,callback);
		} else {
			res.send(string_absentword);
		}
	});
}, 
getDefintionFromDictResponse = function(body) {
	var bodyJson = JSON.parse(body);
	if(bodyJson.results && bodyJson.results.length > 0 && bodyJson.results[0].senses && bodyJson.results[0].senses.length > 0) {
		var sense = bodyJson.results[0].senses[0], response;
		if(sense.definition && sense.definition.length > 0) {
			response = string_definition + sense.definition[0];
		}
		if(sense.examples && sense.examples.length > 0 && sense.examples[0].text) {
			response +=  string_example + sense.examples[0].text;
		}
		return response;
	}
},
sendLineResponseMessage = function(replyJson, callback) {
	var content = {};
	//set content here
	request({
	    url: line_sendmessage,
	    method: "POST",
	    json: true,
	    headers: {
	        "content-type": "application/json",
	        "X-Line-ChannelID": string_channelid,
			"X-Line-ChannelSecret": string_channelsecret,
			"X-Line-Trusted-User-With-ACL": string_channelmid
	    },
	    body: replyJson
	}, function (error, response, body){
		if(error) {
			console.log("ERROR: "+error);
		}
	    callback();
	});
};

/* GET home page. */
router.post('/line', function(req, res, next) {
  var requestJson, querytext;
  var replyJson = {
	  	to: [],
	  	toChannel: 1383378250,
	  	eventType: "138311608800106203",
	  	content: {
	  		contentType:1,
	  		toType:1
	  	}
  	};
  	if(req.body.result) {
	  	if(req.body.result.length === 0) {
	  		console.log(string_noresultparam);
	  	}
	}
	for(i = 0; i < req.body.result.length ; i++) {
		  // get query text typed by user
		  var requestJson = req.body.result[i];
		  if(requestJson.content &&  requestJson.content.text && requestJson.content.from) {
		  	replyJson.to[0] = requestJson.content.from;
			var querytxt = requestJson.content.text;
			console.log(querytxt);
			var query = querytxt.split(" ");
		 	if(query.length > 1) {
		 		if (query[0].toLowerCase() === "define") {
		 			getDefinition(querytxt.substring(querytxt.indexOf(" ") + 1, querytxt.length), replyJson, function() {
						res.sendStatus(200);
					});
		 		}
		 	} else {
		 		replyJson.content.text = string_errorresponse;
		 		sendLineResponseMessage(replyJson, function() {
					res.sendStatus(200);
				});
		 	}
		  } else {
		 	console.log(string_nocontent);
		 }
	}
});
module.exports = router;
