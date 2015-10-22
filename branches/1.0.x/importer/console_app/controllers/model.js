var Asset = require('../models/asset');
var Model = require('../models/model');

exports.postModel = function (req, res) {

	Model.findOne({ModelNo: req.ModelNo}, function (err, doc) {
		if(err) {
			console.log("Some Error:", err);
		}else {
			if(doc == null) {
				
				var m = new Model();
				m.Brand = req.Brand;
				m.ModelNo = req.ModelNo;
				m.ModelName = req.ModelName;

				m.save(function (error, newDoc) {
					if(error) throw error;
					res("New Model Doc created!", newDoc);
				});

			}else {
				res("Model doc already exists...", doc);
			}	
		}
	});
}

var getIndexIfObjWithOwnAttr = function(array, attr, value) {
    for(var i = 0; i < array.length; i++) {
        if(array[i].hasOwnProperty(attr) && array[i][attr] === value) {
            return i;
        }
    }
    return -1;
}

exports.postModelAndParts = function (req, res) {
	Model.findOne({ModelNo: req.ModelNo}, function (err, doc) {
		if(err) {
			console.log(err);
			res(err);
		}else if(doc == null) {

			var m = new Model();
			m.Brand = req.Brand;
			m.ModelNo = req.ModelNo;
			m.ModelName = req.ModelName;

			m.save(function (error, newDoc) {
				if(error) throw error;
				res("New Doc was created..", newDoc);
			});
		}else {
			res("Model already exists in DB...", doc);
		}
	});
}

exports.findOne = function (req, res) {
	Model.findById(req._id, function (err, doc) {
		console.log('got here')
		if(err) throw err;
		doc.Parts = [];
		doc.save(function (error, newDoc) {
			if(error) throw error;
			res(newDoc);
		});
	});
}



exports.findAll = function (res) {
	Model.find({}, function (err, allDocs) {
		if(err) throw err;
		//console.log(allDocs);
		res(allDocs);
	});
}

exports.dropModels = function (res) {
	Model.remove({}, function (err) {
		res("Model collection was dropped.");
	});
}

