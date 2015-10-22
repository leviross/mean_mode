var mongoose = require('mongoose');
var Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;
  
var ContactModel = new mongoose.Schema({
	_id: Number,
	OldId: Number,
	Address: String,
	Address2: String,
	City: String,
	State: String,
	Zip: String,
	NameFirst: String,
	NameLast: String,
	Company: String,
	Email: String,
	Password: String,
	Phone1: String,
	Phone1Type: String,
	Phone2: String,
	Phone2Type: String,
	Type: String,
	DateCreated: String,
    DateModified: String
}, { collection: 'contact' });

ContactModel.set('toJSON', {
	transform: function (doc, ret, options) {
		var retJson = {
			_id: ret._id,
			OldId: ret.OldId,
			Address: ret.Address,
			Address2: ret.Address2,
			City: ret.City,
			State: ret.State,
			Zip: ret.Zip,
			NameFirst: ret.NameFirst,
			NameLast: ret.NameLast,
			Company: ret.Company,
			Email: ret.Email,
			Phone1: ret.Phone1,
			Phone1Type: ret.Phone1Type,
			Phone2: ret.Phone2,
			Phone2Type: ret.Phone2Type,
			Type: ret.Type,
			DateCreated: ret.DateCreated,
		    DateModified: ret.DateModified
		}
		return retJson;
	}
});

module.exports = mongoose.model('Contact', ContactModel);