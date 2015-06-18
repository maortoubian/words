var mongoose = require('mongoose');
mongoose.connect('mongodb://user1:pass1@ds035167.mongolab.com:35167/words');
//var conn = mongoose.connection;

//var translator = require('bingtranslator');
var translator = require('google-translate');
var sequenty = require ('sequenty');


var eMailsSchema = require('./user_schema').eMailsSchema;
mongoose.model('eMails', eMailsSchema);

// var facebookSchema = require('./user_schema').facebookSchema;
// mongoose.model('facebook', facebookSchema);

// var whatsappSchema = require('./user_schema').whatsappSchema;
// mongoose.model('whatsapp', whatsappSchema);

// var smsSchema = require('./user_schema').smsSchema;
// mongoose.model('sms', smsSchema);


// var credentials = {
//   clientId: 'KerensAPI',     /* Client ID from the registered app */
//   clientSecret: 'vmV0OJZCxq9MnA1BFiw0KtjobwmtV65f1DondEGrpO8='  /* Client Secret from the registered app */
// }


// var all = {
//     words: []
// };

// var transArr=[];
// var hintsArr=[];
// var wordsArr=[];
// var favArr=[];
// var voiceArr=[];

// conn.on('error', function (err) {
// 	console.log('connection error' + err);
// 	mongoose.disconnect();
// });

// mongoose.connection.once('open', function() {
// 	console.log('connected');

// 	var eMails = this.model('eMails');
// 	var facebook = this.model('facebook');
// 	var whatsapp = this.model('whatsapp');
// 	var sms = this.model('sms');


// 	function getSmsWords (cb)
// 	{
// 		var query = sms.find();
// 		query.exec(function (err,docs) {
// 			for (var i in docs) {
// 				hintsArr.push(docs[i].hint);
// 				wordsArr.push(docs[i].word);

// 				if (docs[i].favorite == 1) favArr.push(true);
// 				else favArr.push(false);
// 			}
// 			cb();
// 		});
// 	}



// 	function translateSmsWords (cb) {
// 		 var transSmsWords = function (n) {
// 		      if (n < (wordsArr.length)) {
// 		          translator.translate(credentials, wordsArr[n], 'he', 'en', function (err, translated) {
// 					  	if (err) {
// 					    	console.log('error', err);
// 					  	}
// 					  	else {
// 					  		transArr.push(translated);
// 					  		transSmsWords(n + 1);
// 					  	}
// 		          });      
// 		       }
// 		       else cb();
// 		  }
// 	  	transSmsWords(0);  //start the recursive function
// 	}


// 	function printTransArr (cb)	{// just to check the translate array
//    	    cb();
// 	}


// 	function mongoDisconnect (){
// 		mongoose.disconnect();
// 	}

// 	sequenty.run([getSmsWords, translateSmsWords, printTransArr, mongoDisconnect]);

// });

// exports.getWords = function(){	

// 	all.words = [];

// 	for (var i in wordsArr) {
// 		all.words.push({ 
// 			"heb"	: wordsArr[i],
//         	"other"	: transArr[i],
//         	"hint"  : hintsArr[i],
//         	"favorite" : favArr[i]
//   		});
// 	}
// 	return	all;
// };
