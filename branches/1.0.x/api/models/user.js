var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var UserModel = new mongoose.Schema({
	Name: String, 
	Email: String,
	Password: String,
	IsActive: Boolean,
	IsAdmin: Boolean
}, { collection: 'user' });

UserModel.set('toJSON', {
	transform: function (doc, ret, options) {
		var retJson = {
			Email: ret.Email,
			Name: ret.Name,
			IsAdmin: ret.IsAdmin,
			IsActive: ret.IsActive, 
			_id: ret._id
		}
		return retJson;
	}
});

module.exports = mongoose.model('User', UserModel);