var District = require('../models/district');
var Contact = require('../models/contact');

exports.postDistrict = function (req, res) {

	District.findOne({Name: req.body.Name}, function (err, doc) {
		if(err) throw err;
		
		if(doc == null) {

			var d = new District();
			d.Name = req.body.Name;
			d.SendEmail = false;
			d.FullName = req.body.FullName;
			d.Contacts = [];
			d.EmailTemplate = req.body.EmailTemplate;

			d.save(function (error, newDoc) {
				if(error) throw error;
				res.json(newDoc);
				console.log("New District Created: ", newDoc);
			});

		}else {
			res.json(doc);
			console.log("Doc already exists");
		}
	});
}

exports.putDistrict = function (req, res) {
		var districtId = req.params.id;
		var update = req.body; 

		District.findById(districtId, function (err, doc) {
			if(err) throw err;

			doc.Name = update.Name;
			doc.SendEmail = update.SendEmail;
			doc.Contacts = update.Contacts;
			doc.EmailTemplate = update.EmailTemplate;
			doc.FullName = update.FullName;

			doc.save(function (error, newDoc) {
				res.json(newDoc);
				console.log(newDoc);	
			});
		});
}

exports.getAllDistricts = function (req, res) {
	District.find({}, function (err, docs) {
		if(err) throw err;
		res.json(docs)
		//console.log(docs);
	});
}

exports.deleteDistrict = function (req, res) {
	District.findByIdAndRemove(req.params.id, function (err, doc)  {
		if(err) { console.log(err); }
		res.send({message: "District was deleted."});
	});
}






