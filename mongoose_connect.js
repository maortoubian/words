var sequenty = require ('sequenty');
var mongoose = require('mongoose');
var Languages =  require('./Languages.json');

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

var eMailsPicked;
var facebookPicked;
var whatsappPicked;
var smsPicked; 

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

var toLang = '';

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


	//getting the data from MongoDB
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

	//disconnecting from MongoDB
	function mongoDisconnect (){
		mongoose.disconnect();
	}

	sequenty.run([getWordsFromMongo,getWordsFromMongo,getWordsFromMongo,getWordsFromMongo]);

});

//checks which collections the user picked and sending hin the data of those collections
exports.chooseCollections = function(facebook,email,whatsapp,phone){

		if(facebook=="true"){facebookPicked = true;}
		else{facebookPicked = false;}
		if(email=="true"){eMailsPicked = true;}
		else{eMailsPicked = false;}
		if(whatsapp=="true"){whatsappPicked = true;}
		else{whatsappPicked = false;}
		if(phone=="true"){smsPicked = true;}
		else{smsPicked = false;}

		returnCollections();

}

//a function that packing all the words from the collections m there data and transtions 
//and sending to the user
function returnCollections(){

	all.words = [];

	for (var i in wordsArr) {
		if(facebookPicked==true){
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
		if(eMailsPicked==true){
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
		if(whatsappPicked==true){
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
		if(smsPicked==true){
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

//a function that handles the updating of all the DB values: favorites/vocabulary/matrix
exports.updateDB = function(wordForUpd,score,whichValue){

		var valueForDB;
		var collectoinName;
		var collection;

		if(score=="true"){valueForDB=1;valueForFav=true;}
		else{valueForDB=0;valueForFav=false;}

		for(i in all.words){
		 	if(all.words[i].heb==wordForUpd){
		 		collectoinName = all.words[i].collection;

		 		if(whichValue==1){all.words[i].favorite = valueForFav;}
		 		if(whichValue==2){all.words[i].vocabulary = valueForDB;}
		 		if(whichValue==3){all.words[i].matrix = valueForDB;}

		 	}
		}

		for(i in wordsArr){
		 	if(wordsArr[i]==wordForUpd){

		 		if(whichValue==1){favArr[i] = valueForFav;}
		 		if(whichValue==2){vocabularyArr[i] = valueForDB;}
		 		if(whichValue==3){matrixArr[i] = valueForDB;}
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

						if(whichValue==1){
								var query = doc.update({$set:{favorite:valueForDB}});
								query.exec(function (err,doc) {
									console.log("favorite has changed");
								});
						}
						if(whichValue==2){
								var query = doc.update({$set:{vocabulary:valueForDB}});
								query.exec(function (err,doc) {
									console.log("score vocabulary has changed");
								});
						}
						if(whichValue==3){
								var query = doc.update({$set:{matrix:valueForDB}});
								query.exec(function (err,doc) {
									console.log("matrix has changed");
								});
						}

					});
				}
		});
		return 1;
}

//a function that deleting the wanted word
exports.removeWord = function(wordForUpd){

		var collectoinName;
		var collection;

		if(wordForUpd!=""){

			for(i in all.words){
			 	if(all.words[i].heb==wordForUpd){

			 		collectoinName = all.words[i].collection; 
			 		
			 		all.words.splice(i,1);	
					wordsArr.splice(i,1);
					transArr.splice(i,1);
					hintsArr.splice(i,1);
					favArr.splice(i,1);
					collectionIDArr.splice(i,1);
					matrixArr.splice(i,1);
					vocabularyArr.splice(i,1);
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

//returns the languages Json
exports.getLanguages = function(){
	return Languages;
}

//a function that translate the words of the collections by using reqursive and sequenlty calls
exports.LanguagesToTranslate = function(LanguageFromUser){

	count=0;
	console.log(toLang);

	if(LanguageFromUser!=toLang){

		toLang = LanguageFromUser;
		transArr = [];

		function translateWords (cb) {
				 var transWords = function (n) {

				      if (n < (wordsArr.length)) {

				          translator.translate(wordsArr[n], 'he', toLang, function (err, translated) {
							  	if (err) {
							    	console.log('error', err);
							  	}
							  	else {
							  		transArr.push(translated.translated_text);
							  		transWords(n + 1);

							  		console.log(count+" : "+translated.translated_text);	
							  		count++;

							  	}
				          });      
				       }
				  }
			  	transWords(0);  //start the recursive function
			  	cb();
		}

		sequenty.run([translateWords]);
	}
	return 1;
}
  
//returning all the wanted words in Json
exports.getWords = function(){
	returnCollections();
	return	all;	
};
