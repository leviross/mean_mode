var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var DistrictModel = new mongoose.Schema({
	// _id: ObjectId,
	Name: String, 
	SendEmail: Boolean, 
	FullName: String,
	Contacts: Array,
	EmailTemplate: String
}, {collection: 'district'});

module.exports = mongoose.model('District', DistrictModel);