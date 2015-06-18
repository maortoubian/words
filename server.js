var express = require('express');
//var mongoose = require('./mongoose_connect');
var app = express();


app.get('/', function (req, res) {
  res.send('Hello World')
})

//app.get('/', function(req,res) {

	// res.header("Access-Control-Allow-Origin", "*");
	// res.header("Access-Control-Allow-Header", "Origin, X-Requested-With,Content-Type, Accept");
	// app.set('json spaces',4);
	// res.set("Content-Type", "application/json");
	//res.status(200);
	//res.json(mongoose.getWords());


//});


app.listen(process.env.PORT || 3000);
console.log("web service is listening on port 3000");

