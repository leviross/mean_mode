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
				res(newDoc);
			});

		}else {
			res("That serial # already exists in DB");
		}
	});
}

exports.getSerialNos = function (req, res) {
	console.log(req.params);
	Asset.find({SerialNo: {$regex: '^' + req.params.serialno, $options: 'i'}}, function (err, serialsArr) {
		if(err) {
			console.log(err);
		}else {
			console.log(serialsArr);
			res.json(serialsArr);
		}
	}).limit(15);

}

exports.getTagNos = function (req, res) {
	Asset.find({TagNo: {$regex: '^' + req.params.tagno, $options: 'i'}}, function (err, tagsArr) {
		if(err) {
			console.log(err);
		}else {
			console.log(tagsArr);
			res.json(tagsArr);
		}
	}).limit(15);
}

exports.dropAssets = function (res) {
	Asset.remove({}, function (err) {
		res("Assets collection was dropped.");
	});
}