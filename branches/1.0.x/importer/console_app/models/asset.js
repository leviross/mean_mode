var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;


var AssetModel = new mongoose.Schema({
	id: ObjectId,
	TagNo: String,
	ModelId: String,
	SerialNo: String
}, {versionKey: false}, { collection: 'asset' });

module.exports = mongoose.model('Asset', AssetModel);