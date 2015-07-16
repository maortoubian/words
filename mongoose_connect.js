var sequenty = require ('sequenty');
var mongoose = require('mongoose');

mongoose.connect('mongodb://user1:pass1@ds035167.mongolab.com:35167/words');
var conn = mongoose.connection;

var translator = require('bing-translate').init({
    client_id: 'KerensAPI', 										/* Client ID from the registered app */
    client_secret: 'vmV0OJZCxq9MnA1BFiw0KtjobwmtV65f1DondEGrpO8='   /* Client Secret from the registered app */
});

var eMailsSchema = require('./user_schema').eMailsSchema;
mongoose.model('eMails', eMailsSchema);

var facebookSchema = require('./user_schema').facebookSchema;
mongoose.model('facebook', facebookSchema);

var whatsappSchema = require('./user_schema').whatsappSchema;
mongoose.model('whatsapp', whatsappSchema);

var smsSchema = require('./user_schema').smsSchema;
mongoose.model('sms', smsSchema);

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
var matrixArr=[];
var vocabularyArr=[];
var collectionIDArr=[];


conn.on('error', function (err) {
	console.log('connection error' + err);
	mongoose.disconnect();
});

mongoose.connection.once('open', function() {

	console.log('connected to mongolab');

	eMails = this.model('eMails');
	facebook = this.model('facebook');
	whatsapp = this.model('whatsapp');
	sms = this.model('sms');

	var collArr = new Array(eMails, facebook, whatsapp, sms);
	var collNameArr = new Array("eMails","facebook","whatsapp","sms");

	function getWordsFromMongo (cb){

			collectionID=collNameArr[collNameArr.length-1];
			collection = collArr[collArr.length-1];	
			collArr.pop();

			var query = collection.find();

			query.exec(function (err,docs) {
				for (var i in docs) {
					hintsArr.push(docs[i].hint);
					wordsArr.push(docs[i].word);
					matrixArr.push(docs[i].matrix);
					vocabularyArr.push(docs[i].vocabulary);

					if (docs[i].favorite == 1) favArr.push(true);
					else favArr.push(false);

					collectionIDArr.push(collectionID);

				}
				collNameArr.pop();
				cb();
			});
	}

	function translateWords (cb) {
			 var transWords = function (n) {

			      if (n < (wordsArr.length)) {

			          translator.translate(wordsArr[n], 'he', 'en', function (err, translated) {
						  	if (err) {
						    	console.log('error', err);
						  	}
						  	else {
						  		transArr.push(translated.translated_text);
						  		console.log(translated.translated_text);
						  		transWords(n + 1);
						  	}
			          });      
			       }
			  }
		  	transWords(0);  //start the recursive function
		  	cb();
	}

	sequenty.run([getWordsFromMongo,getWordsFromMongo,getWordsFromMongo,getWordsFromMongo,translateWords]);

	function mongoDisconnect (){
		mongoose.disconnect();
	}

});

exports.chooseCollections = function(facebook,email,whatsapp,phone){

	all.words = [];

	for (var i in wordsArr) {
		if(facebook=="true"){
				if(collectionIDArr[i]=="facebook"){

					all.words.push({ 
						"heb"	: wordsArr[i],
			        	"other"	: transArr[i],
			        	"hint"  : hintsArr[i],
			        	"favorite": favArr[i],
			        	"collection": collectionIDArr[i],
			        	"matrix": matrixArr[i],
						"vocabulary": vocabularyArr[i]
			  		});	
				}
		}
		if(email=="true"){
				if(collectionIDArr[i]=="eMails"){

					all.words.push({ 
						"heb"	: wordsArr[i],
			        	"other"	: transArr[i],
			        	"hint"  : hintsArr[i],
			        	"favorite": favArr[i],
			        	"collection": collectionIDArr[i],
			        	"matrix": matrixArr[i],
						"vocabulary": vocabularyArr[i]
			  		});	
				}
		}
		if(whatsapp=="true"){
				if(collectionIDArr[i]=="whatsapp"){

					all.words.push({ 
						"heb"	: wordsArr[i],
			        	"other"	: transArr[i],
			        	"hint"  : hintsArr[i],
			        	"favorite": favArr[i],
			        	"collection": collectionIDArr[i],
			        	"matrix": matrixArr[i],
						"vocabulary": vocabularyArr[i]

			  		});	
				}
		}
		if(phone=="true"){
			if(collectionIDArr[i]=="sms"){

					all.words.push({ 
						"heb"	: wordsArr[i],
			        	"other"	: transArr[i],
			        	"hint"  : hintsArr[i],
			        	"favorite": favArr[i],
			        	"collection": collectionIDArr[i],
			        	"matrix": matrixArr[i],
						"vocabulary": vocabularyArr[i]
			        	
			  		});	
				}
		}
	}
	return all;
};

exports.updateFavorite = function(wordForUpd,fav){

		var favoriteForDB;
		var collectoinName;
		var collection;

		if(fav=="true"){favoriteForDB=1;favoriteForAll=true;}
		else{favoriteForDB=0;favoriteForAll=false;}

		for(i in all.words){
		 	if(all.words[i].heb==wordForUpd){
		 		collectoinName = all.words[i].collection;
		 		all.words[i].favorite = favoriteForAll;
		 	}
		}

		for(i in wordsArr){
		 	if(wordsArr[i]==wordForUpd){	
		 		favArr[i] = favoriteForAll;
		 	}
		}


		if(collectoinName=="facebook"){collection=facebook;}
		else if(collectoinName=="eMails"){collection=eMails;}
		else if(collectoinName=="whatsapp"){collection=whatsapp;}	
		else if(collectoinName=="sms"){collection=sms;}

		var query = collection.find({'word': wordForUpd});
		query.exec(function (err,docs) {

				if(docs!=0){
					console.log("word Found");
					collection.findOne({'word': wordForUpd},function(err,doc){
						var query = doc.update({$set:{favorite:favoriteForDB}});
						query.exec(function (err,doc) {
							console.log("favorite has changed");
						});
					});
				}
		});
		return 1;
}

exports.updateVocabulary = function(wordForUpd,score){

		var collectoinName;
		var collection;

console.log("wordForUpd " +wordForUpd);
console.log("score " +score);



		for(i in all.words){
		 	if(all.words[i].heb==wordForUpd){
		 		collectoinName = all.words[i].collection; 
		 		all.words[i].vocabulary = score;
		 	}
		}

		for(i in wordsArr){
		 	if(wordsArr[i]==wordForUpd){	
		 		vocabularyArr[i] = score;
		 	}
		}

		if(collectoinName=="facebook"){collection=facebook;}
		else if(collectoinName=="eMails"){collection=eMails;}
		else if(collectoinName=="whatsapp"){collection=whatsapp;}	
		else if(collectoinName=="sms"){collection=sms;}

		var query = collection.find({'word': wordForUpd});
		query.exec(function (err,docs) {

				if(docs!=0){
					console.log("word Found");
					collection.findOne({'word': wordForUpd},function(err,doc){
						var query = doc.update({$set:{vocabulary:score}});
						query.exec(function (err,doc) {
							console.log("score vocabulary has changed");
						});
					});
				}
		});
		return 1;
}

exports.removeWord = function(wordForUpd){

		var collectoinName;
		var collection;

		if(wordForUpd!=""){

			for(i in all.words){
			 	if(all.words[i].heb==wordForUpd){

			 		collectoinName = all.words[i].collection; 
			 		delete all.words[i];
			 	}
			}

			if(collectoinName=="facebook"){collection=facebook;}
			else if(collectoinName=="eMails"){collection=eMails;}
			else if(collectoinName=="whatsapp"){collection=whatsapp;}	
			else if(collectoinName=="sms"){collection=sms;}

			var query = collection.find({'word': wordForUpd});
			query.exec(function (err,docs) {

					if(docs!=0){
						console.log("word Found");
						collection.findOne({'word': wordForUpd},function(err,doc){
						 	doc.remove({'word': wordForUpd});
						 	console.log("word Removed");
						});
					}
			});
			
		}

		return 1;
}

exports.getWords = function(){
	return	all;	
};
