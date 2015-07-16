var mongoose = require ('mongoose');
var Schema = mongoose.Schema;

var eMailsSchema = new Schema({
	word: {type:String, index:1, required: true, unique: true},
	favorite: Number,
	matrix: Number,
	vocabulary: Number,
	hint: String
}, {collection: 'eMails'});

var facebookSchema = new Schema({
	word: {type:String, index:1, required: true, unique: true},
	favorite: Number,
	matrix: Number,
	vocabulary: Number,
	hint: String
}, {collection: 'facebook'});

var whatsappSchema = new Schema({
	word: {type:String, index:1, required: true, unique: true},
	favorite: Number,
	matrix: Number,
	vocabulary: Number,
	hint: String
}, {collection: 'whatsapp'});

var smsSchema = new Schema({
	word: {type:String, index:1, required: true, unique: true},
	favorite: Number,
	matrix: Number,
	vocabulary: Number,
	hint: String
}, {collection: 'SMS'});

exports.eMailsSchema = eMailsSchema;
exports.facebookSchema = facebookSchema;
exports.whatsappSchema = whatsappSchema;
exports.smsSchema = smsSchema;
