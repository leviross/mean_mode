var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var PartModel = new mongoose.Schema({
	_id: Number,
	No: String, 
	Desc: String, 
	Cost: Number, 
	Price: Number,
	Models: Array
}, {versionKey: false}, { collection: 'part' });

module.exports = mongoose.model('Part', PartModel);