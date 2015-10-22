var Model = require('../models/model');
var Asset = require('../models/asset');

exports.postAsset = function (req, res) {

	Asset.findOne({SerialNo: req.SerialNo}, function (err, doc) {
		if(err) throw err;

		if(doc == null) {

			var a = new Asset();
			a.SerialNo = req.SerialNo;
			a.TagNo = req.TagNo;
			a.ModelId = req.ModelId;

			a.save(function (error, newDoc) {
				if(error) throw error;
				console.log("New Asset Doc: ", newDoc);
				res(newDoc);
			});

		}else {
			res("That serial # already exists in DB");
		}
	});
}

exports.getSerialNos = function (req, res) {
	Asset.find({SerialNo: {$regex: '^' + req.params.serial, $options: 'i'}}, function (err, doc) {
		if(err) {
			console.log(err);
		}else {

		}
	})

}

exports.findAll = function (res) {
	Asset.find({}, function (err, allDocs) {
		if(err) throw err;
		//console.log(allDocs);
		res(allDocs);
	});
}

exports.dropAssets = function (res) {
	Asset.remove({}, function (err) {
		res("Assets collection was dropped.");
	});
}