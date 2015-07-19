var express = require('express');
var mongoose = require('./mongoose_connect');
var matrix = require('./matrixArrays');
var app = express();
var url = require('url');



app.get('/', function(req,res) {

	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Header", "Origin, X-Requested-With,Content-Type, Accept");
	app.set('json spaces',4);
	res.set("Content-Type", "application/json");
	res.status(200);

	res.json(mongoose.getWords());

});

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

app.get('/getLanguages', function(req,res) {

	var i = mongoose.getLanguages();

	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Header", "Origin, X-Requested-With,Content-Type, Accept");
	res.set("Content-Type", "application/json");
	res.status(200);
	
	res.json(i);

});

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

