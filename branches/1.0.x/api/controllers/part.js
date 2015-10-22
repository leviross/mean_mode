var Part = require('../models/part');
var Counter = require('../models/counter');
var Model = require('../models/model');



exports.createPart = function (req, res) {
	var modelObj = null;
	Part.findOne({No: req.body.No}, function (partErr, partDoc) {
		if(partErr) throw partErr;

		if(partDoc == null) {
			Model.findOne({ModelNo: req.body.ModelNo}, function (modelErr, modelDoc) {
				if(modelErr) throw modelErr;
				if(modelDoc == null) {
					var m = new Model();
					m.ModelNo = req.body.ModelNo;
					m.ModelName = req.body.ModelName;
					m.Brand = req.body.Brand;
					m.save(function (modelError, newModelDoc) {
						if(modelError) throw modelError;
						modelObj = newModelDoc;
						console.log("While creating a Part, a new Model was created in Models collection also.", newModelDoc);
						GenNextId("Parts");	
					});
				}else {
					modelObj = modelDoc;
					console.log("While creating a new Part, the model # already existed in Models collection.");
					GenNextId("Parts");	
				}
			});
			function GenNextId (whocares) {
				var query = { _id: whocares };
				var update = { $inc: { seq: 1} };
				var options = { new: true };
				Counter.findOneAndUpdate(query, update, options, function (counterErr, counterDoc) {
					if(counterErr) {
						console.log("counterError on updating Id", counterErr);
					}
					var p = new Part();
					p._id = counterDoc.seq;
					p.No = req.body.No;
					p.Desc = req.body.Desc;
					p.Price = req.body.Price;
					p.Cost = req.body.Cost;

					p.Models.push(modelObj);

					p.save(function (PartError, newPartDoc) {
						if(PartError) throw PartError;
						console.log("New Part doc created.",newPartDoc);
						res.json(newPartDoc);
					});
				});	
			}	
			
		}else {
			res.json({AlreadyExists: "That Part No already exists in DB..."});
			console.log("That Part No already exists in DB...");
		}	
	});	
}

exports.putPartById = function (req, res) {
	
	Part.findById(req.params.id, function (err, doc) {
		if(err) throw err;
		if(doc == null) res.send("Cant find that Part in the DB.");

		doc.No = req.body.No;
		doc.Desc = req.body.Desc;
		doc.Cost = req.body.Cost;
		doc.Price = req.body.Price;

		doc.Models[0].ModelName = req.body.ModelName;
		doc.Models[0].ModelNo = req.body.ModelNo;
		doc.markModified('Models');


		doc.save(function (error, updatedDoc) {
			if(error) throw error;
			var modelObj = updatedDoc.Models[0];
			var modelId = modelObj._id;
			delete modelObj._id;
			Model.findByIdAndUpdate(modelId, modelObj, {new: true}, function (err, modelDoc) {
				if(err) throw err;
				res.json(updatedDoc);
				console.log("Part and that Model attached were updated...", updatedDoc);
				console.log("Here is the updated Model doc...", modelDoc);
			});
			
		});
	});
}

exports.getPartNos = function (req, res) {
	console.log(req.params.partno);
	Part.find({No: {$regex: '^' + req.params.partno, $options: 'i'}}, function (err, docs) {
		if(err) throw err;
		res.json(docs);
		console.log(docs);
	});
}

exports.getPartById = function (req, res) {
	Part.findById(req.params.id, function (err, doc) {
		if(err) throw err;
		res.json(doc);
		console.log(doc);
	});
}

exports.getPartDesc = function (req, res) {
	console.log(req.params.partdesc);
	Part.find({Desc: {$regex: req.params.partdesc, $options: 'mi'}}, function (err, docs) {
		if(err) throw err;
		res.json(docs);
		console.log(docs);
	});
}

exports.deletePartById = function (req, res) {
	Part.findByIdAndRemove(req.params.id, function (err, doc) {
		if(err) throw err;
		res.json({Message: "Part has been deleted."});
		console.log({Message: "Part has been deleted."});
	});
}