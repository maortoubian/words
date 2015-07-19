var express = require('express');
var mongoose = require('./mongoose_connect');
var matrix = require('./matrixArrays');
var app = express();
var url = require('url');


//root page that sends the user the Json with all the wanted data
app.get('/', function(req,res) {

	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Header", "Origin, X-Requested-With,Content-Type, Accept");
	app.set('json spaces',4);
	res.set("Content-Type", "application/json");
	res.status(200);

	res.json(mongoose.getWords());

});

//getting the collection pick from the user
app.get('/collection', function(req,res) {

	var urlObj = url.parse(req.url,true);
	var query = urlObj.query;

	var i = mongoose.chooseCollections(query.facebook,query.email,query.whatsapp,query.phone);

	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Header", "Origin, X-Requested-With,Content-Type, Accept");
	res.set("Content-Type", "application/json");
	res.status(200);
	
	res.json(i);

});

//getting from the user the word that needs to be delete
app.get('/remove', function(req,res) {

	var urlObj = url.parse(req.url,true);
	var query = urlObj.query;

	var i = mongoose.removeWord(query.word);

	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Header", "Origin, X-Requested-With,Content-Type, Accept");
	res.set("Content-Type", "application/json");
	res.status(200);

	res.json(i);

});

//sending the user the Json with all the languages
app.get('/getLanguages', function(req,res) {

	var i = mongoose.getLanguages();

	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Header", "Origin, X-Requested-With,Content-Type, Accept");
	res.set("Content-Type", "application/json");
	res.status(200);
	
	res.json(i);

});

//getting from the user the languages he picked
app.get('/LanguagesToTranslate', function(req,res) {

	var urlObj = url.parse(req.url,true);
	var query = urlObj.query;

	var i = mongoose.LanguagesToTranslate(query.toLang);

	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Header", "Origin, X-Requested-With,Content-Type, Accept");
	res.set("Content-Type", "application/json");
	res.status(200);

	res.json(i);

});

//geting a word from the user and sending him back a json that is ready for the matrix game
app.get('/matrix', function(req,res) {

	var urlObj = url.parse(req.url,true);
	var query = urlObj.query;

	var i = matrix.getMatrixArrays(query.word);

	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Header", "Origin, X-Requested-With,Content-Type, Accept");
	res.set("Content-Type", "application/json");
	res.status(200);

	res.json(i);

});

//geting from the user the word the score and the game id for saving the value in the DB
app.get('/updateDB', function(req,res) {
	
	var urlObj = url.parse(req.url,true);
	var query = urlObj.query;
	var i =	mongoose.updateDB(query.word,query.score,query.game);

	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Header", "Origin, X-Requested-With,Content-Type, Accept");
	res.set("Content-Type", "application/json");
	res.status(200);

	res.json(i);

});



app.listen(process.env.PORT || 3000);
console.log("web service is listening on port 3000");

