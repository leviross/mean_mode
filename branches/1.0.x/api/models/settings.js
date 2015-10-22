var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var SettingsModel = new mongoose.Schema({
	Name: String,
	Value: Number
}, { collection: 'settings' });

module.exports = mongoose.model('Settings', SettingsModel);