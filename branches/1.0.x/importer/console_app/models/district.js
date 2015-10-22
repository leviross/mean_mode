var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var DistrictModel = new mongoose.Schema({
	_id: ObjectId,
	Name: String, 
	SendEmail: Boolean, 
	SendToWhom: Array,
	Contacts: Array,
	EmailFields: Array
}, {versionKey: false}, {collection: 'district'});

module.exports = mongoose.model('District', DistrictModel);