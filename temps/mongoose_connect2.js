var sequenty = require ('sequenty');
var mongoose = require('mongoose');

mongoose.connect('mongodb://user1:pass1@ds035167.mongolab.com:35167/words');
var conn = mongoose.connection;

//   clientId: 'KerensAPI',     /* Client ID from the registered app */
//   clientSecret: 'vmV0OJZCxq9MnA1BFiw0KtjobwmtV65f1DondEGrpO8='  /* Client Secret from the registered app */

var translator = require('bing-translate').init({
    client_id: 'KerensAPI', 
    client_secret: 'vmV0OJZCxq9MnA1BFiw0KtjobwmtV65f1DondEGrpO8='
});

var eMailsSchema = require('./user_schema').eMailsSchema;
mongoose.model('eMails', eMailsSchema);

var facebookSchema = require('./user_schema').facebookSchema;
mongoose.model('facebook', facebookSchema);

var whatsappSchema = require('./user_schema').whatsappSchema;
mongoose.model('whatsapp', whatsappSchema);

var smsSchema = require('./user_schema').smsSchema;
mongoose.model('sms', smsSchema);

var facebookCollection;
var emailCollection;
var whatsappCollection;
var phoneCollection;

var eMails;
var facebook;
var whatsapp;
var sms;

var all = {
    words: []
};

var transArr=[];
var hintsArr=[];
var wordsArr=[];
var favArr=[];

var transArr1=[];
var hintsArr1=[];
var wordsArr1=[];
var favArr1=[];

var transArr2=[];
var hintsArr2=[];
var wordsArr2=[];
var favArr2=[];

var transArr3=[];
var hintsArr3=[];
var wordsArr3=[];
var favArr3=[];

conn.on('error', function (err) {
	console.log('connection error' + err);
	mongoose.disconnect();
});

mongoose.connection.once('open', function() {

	console.log('connected');

	eMails = this.model('eMails');
	facebook = this.model('facebook');
	whatsapp = this.model('whatsapp');
	sms = this.model('sms');

	function getSmsWords (cb){

		var query = sms.find();
		query.exec(function (err,docs) {
			for (var i in docs) {
				hintsArr.push(docs[i].hint);
				wordsArr.push(docs[i].word);

				if (docs[i].favorite == 1) favArr.push(true);
				else favArr.push(false);
			}
			cb();
		});
	}

 	function translateSmsWords (cb) {
		 var transSmsWords = function (n) {
		      if (n < (wordsArr.length)) {

		          translator.translate(wordsArr[n], 'he', 'en', function (err, translated) {
					  	if (err) {
					    	console.log('error', err);
					  	}
					  	else {
					  		transArr.push(translated.translated_text);
					  		transSmsWords(n + 1);
					  	}
		          });      
		       }
		       else cb();
		  }
	  	transSmsWords(0);  //start the recursive function
	}

	function getEmailWords (cb){

		var query = eMails.find();
		query.exec(function (err,docs) {
			for (var i in docs) {
				hintsArr1.push(docs[i].hint);
				wordsArr1.push(docs[i].word);

				if (docs[i].favorite == 1) favArr1.push(true);
				else favArr1.push(false);
			}
			cb();
		});
	}

 	function translateEmailWords (cb) {
		 var transEmailWords = function (n) {
		      if (n < (wordsArr1.length)) {

		          translator.translate(wordsArr1[n], 'he', 'en', function (err, translated) {
					  	if (err) {
					    	console.log('error', err);
					  	}
					  	else {
					  		transArr1.push(translated.translated_text);
					  		transEmailWords(n + 1);
					  	}
		          });      
		       }
		       else cb();
		  }
	  	transEmailWords(0);  //start the recursive function
	}

		function getWhatsappWords (cb){

		var query = whatsapp.find();
		query.exec(function (err,docs) {
			for (var i in docs) {
				hintsArr2.push(docs[i].hint);
				wordsArr2.push(docs[i].word);

				if (docs[i].favorite == 1) favArr2.push(true);
				else favArr2.push(false);
			}
			cb();
		});
	}

 	function translateWhatsappWords (cb) {
		 var transWhatsappWords = function (n) {
		      if (n < (wordsArr2.length)) {

		          translator.translate(wordsArr2[n], 'he', 'en', function (err, translated) {
					  	if (err) {
					    	console.log('error', err);
					  	}
					  	else {
					  		transArr2.push(translated.translated_text);
					  		transWhatsappWords(n + 1);
					  	}
		          });      
		       }
		       else cb();
		  }
	  	transWhatsappWords(0);  //start the recursive function
	}

		function getFacebookWords (cb){

		var query = facebook.find();
		query.exec(function (err,docs) {
			for (var i in docs) {
				hintsArr3.push(docs[i].hint);
				wordsArr3.push(docs[i].word);

				if (docs[i].favorite == 1) favArr3.push(true);
				else favArr3.push(false);
			}
			cb();
		});
	}

 	function translateFacebookWords (cb) {
		 var transFacebookWords = function (n) {
		      if (n < (wordsArr3.length)) {

		          translator.translate(wordsArr3[n], 'he', 'en', function (err, translated) {
					  	if (err) {
					    	console.log('error', err);
					  	}
					  	else {
					  		transArr3.push(translated.translated_text);
					  		transFacebookWords(n + 1);
					  	}
		          });      
		       }
		       else cb();
		  }
	  	transFacebookWords(0);  //start the recursive function
	}

	function printTransArr (cb)	{// just to check the translate array
   	    cb();
	}

	function mongoDisconnect (){
	//	mongoose.disconnect();
	}

	sequenty.run([getSmsWords, translateSmsWords,
					getEmailWords,translateEmailWords,
					getWhatsappWords,translateWhatsappWords,
					getFacebookWords,translateFacebookWords,
					printTransArr, mongoDisconnect]);

});

function getUpdatedFavorites (){

		favArr=[];

		var query = sms.find();
		query.exec(function (err,docs) {
			for (var i in docs) {

				if (docs[i].favorite == 1){console.log(docs[i].favorite); favArr.push(true);}
				else favArr.push(false);
			}
		});
	}




function filterCollections(f,e,w,p){

	all.words = [];

	if(f=="true"){

		for (var i in wordsArr) {
			all.words.push({ 
				"heb"	: wordsArr[i],
	        	"other"	: transArr[i],
	        	"hint"  : hintsArr[i],
	        	"favorite" : favArr[i]
	  		});	
		}
	}
	if(e=="true"){

		for (var i in wordsArr1) {
			all.words.push({ 
				"heb"	: wordsArr1[i],
	        	"other"	: transArr1[i],
	        	"hint"  : hintsArr1[i],
	        	"favorite" : favArr1[i]
	  		});	
		}
	}
	if(w=="true"){

		for (var i in wordsArr2) {
			all.words.push({ 
				"heb"	: wordsArr2[i],
	        	"other"	: transArr2[i],
	        	"hint"  : hintsArr2[i],
	        	"favorite" : favArr2[i]
	  		});	
		}
	}
	if(p=="true"){

		for (var i in wordsArr3) {
			all.words.push({ 
				"heb"	: wordsArr3[i],
	        	"other"	: transArr3[i],
	        	"hint"  : hintsArr3[i],
	        	"favorite" : favArr3[i]
	  		});	
		}
	}
	return	all;
};


exports.chooseCollections = function(facebook,email,whatsapp,phone){

	facebookCollection = facebook;
	emailCollection = email;
	whatsappCollection = whatsapp;
	phoneCollection = phone;

	return filterCollections(facebookCollection,emailCollection,whatsappCollection,phoneCollection);

};


exports.getWords = function(){	

	return	all;
	
};

exports.updateFavorite = function(wordForUpd,fav){

		var favoriteForDB;
		if(fav=="true"){
			favoriteForDB=1;
		}
		else{
			favoriteForDB=0;
		}

		for(i in wordsArr){
			if(wordsArr[i]==wordForUpd){

				console.log("--------------------------------");  
				console.log(transArr[i]);  
				console.log(fav);
				console.log("--------------------------------"); 

				favArr[i] = fav;
			}
		}

		// var queryEmail = eMails.find({'word': wordForUpd});
		// var queryFacebook = facebook.find({'word': wordForUpd});
		// var queryWhatsapp = whatsapp.find({'word': wordForUpd});
		var querySms = sms.find({'word': wordForUpd});

		// queryEmail.exec(function (err,docs) {
		// 	if(docs!=0){
		// 		console.log("Found in Email");
		// 	}
		// });

		// queryFacebook.exec(function (err,docs) {
		// 	if(docs!=0){
		// 		console.log("Found in Facebook");
		// 	}
		// });

		// queryWhatsapp.exec(function (err,docs) {
		// 	if(docs!=0){
		// 		console.log("Found in Whatsapp");
		// 	}
		// });

		querySms.exec(function (err,docs) {

			console.log("querySms.exec");

			if(docs!=0){

				console.log("Found in Sms");

				sms.findOne({'word': wordForUpd},function(err,doc){

					var query = doc.update({$set:{favorite:favoriteForDB}});
					query.exec(function (err,doc) {
						console.log("done");
					});

				});
			}
		});

		return 1;

};