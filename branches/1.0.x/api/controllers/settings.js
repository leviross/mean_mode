var Settings = require('../models/settings');

exports.putSetting = function (req, res) {
	console.log(req.body);

	Settings.findOne( {Name: req.params.name}, function (err, setting) {
		if(err) throw err;

		setting.Value = req.body.TaxRate;
		setting.save(function (error) {
			if(error) {
				console.log("Error updating this setting:", error);
			}
			console.log("Setting updated:", setting);
			res.json(setting);
		});
	});
}

exports.getSettings = function (req, res) {
	Settings.find({}, function (err, settings) {
		console.log(settings);
		res.json(settings);
	});
}

exports.getSetting = function (req, res) {

	Settings.findOne({Name: req.params.name}, function (err, setting) {
		if(err) throw err;

		res.json(setting);
		//console.log(setting);
	});
}

exports.postSetting = function (req, res) {
	console.log("Req.body:", req.body);
	var s = new Settings();

	s.Name = req.body.Name;
	s.Value = req.body.Rate;
	s.save(function (err) {
		if(err) throw err;
		console.log(s);
		res.json(s);
	});
}

exports.deleteSetting = function (req, res) {
	Settings.findByIdAndRemove(req.params.id, function (err) {
		if(err) throw err;
		res.json({message: "Setting deleted"});
	});
} 








