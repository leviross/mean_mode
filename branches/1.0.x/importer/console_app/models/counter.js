var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CounterModel = new mongoose.Schema({
	_id: String,
	seq: Number
}, { collection: 'counter' });

module.exports = mongoose.model('Counter', CounterModel);