var Model = require('../models/model');

exports.getModelNo = function (req, res) {
	console.log("THIS IS REQ.PARAMS----", req.params.modelno);
    Model.findOne({ModelNo: {$regex: '^' + req.params.modelno + '$', $options: 'i'}}, function (err, retval) {
		if(err) {
			res.send(err);
		}else{
			res.json(retval);
			console.log('RETVAL----', retval);
		}
	});
}

exports.postModels = function (req, res) {

	var model = new Model();
	model.Brand = req.body.Brand;
	model.ModelName = req.body.ModelName;
	model.ModelNo = req.body.ModelNo;

	model.save(function (err, model) {
		if(err) console.log(err);
		res.json(model);
		console.log("New model doc", model);
	});
}

exports.putModelById = function (req, res) {

	Model.findById(req.params.id, function (err, doc) {

		if(err) throw err;
		if(doc == null) {
			console.log("Cant find that Model in the DB.");
		}else {
			doc.ModelName = req.body.ModelName;
			doc.ModelNo = req.body.ModelNo;
			doc.save(function (error, newDoc) {
				if(error) throw error;
				res.json(newDoc);
				console.log("Model Doc updated...", newDoc);
			});
		}
	});
}
 
exports.getModelsByBrand = function (req, res) {
	Model.find({Brand: req.params.brand}, function (err, retval) {
		if(err) {
			res.send(err);
			console.log(err);
		}else {
			res.json(retval);
			console.log(retval);
		}
	});
}
//this returns partial model nos ...
exports.getModelNos = function (req, res) {
	console.log(req.params);
	Model.find({ModelNo: {$regex: '^' + req.params.modelno, $options: 'i'}}, function (err, modelsArr) {
		if(err) { console.log(err); }
		res.json(modelsArr);
		console.log(modelsArr);
	});
}

exports.getModelById = function (req, res) {//THIS IS NOT FINDING BY ID FOR SOME REASON. PUT METHOD WORKS VIA THE OBJECT ID, DONT KNOW WHY THIS DOESNT WORK NOW. 
	
	Model.findById(req.params.id, function (err, doc) {

		if(err) { console.log(err); }

		if(doc == null) {
			console.log("Cant find that Model in the DB.");
			res.json(doc);
		}else {
			console.log(doc);
			res.json(doc);
		}

	});
}


exports.getAllModels = function (req, res) {
	Model.find({}, function (err, modelsArr) {
		if(err) throw err;
		res.json(modelsArr);
	});
}

exports.deleteModelById = function (req, res) {
    Model.findByIdAndRemove(req.params.id, function (err) {
		if(err){
			res.send(err);
		}else{
			res.json({ message: 'Model deleted' });
		}
	});
}
