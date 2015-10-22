var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var ModelsModel = new mongoose.Schema({
	// id: ObjectId,
	Brand: String,
	ModelNo: String,
	ModelName: String
}, {versionKey: false}, { collection: 'model' });

module.exports = mongoose.model('Model', ModelsModel);	