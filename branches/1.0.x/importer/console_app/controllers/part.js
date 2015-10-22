var Part = require('../models/part');
var Counter = require('../models/counter');

exports.postPart = function (req, res) {

	Part.findOne({No: req.PartNo}, function (partErr, partDoc) {
		var modelObj = {Brand: req.Model.Brand, ModelName: req.Model.ModelName, ModelNo: req.Model.ModelNo, _id: req.Model._id};
		if(partErr) {
			console.log("Some error...", partErr);
		}else if(partDoc == null) {

			function GenNextId (whocares) {
				var query = { _id: whocares };
				var update = { $inc: { seq: 1} };
				var options = { new: true };
				Counter.findOneAndUpdate(query, update, options, function (counterErr, counterDoc) {
					if(counterErr) {
						console.log("Error on updating Id", counterErr);
					}
					var p = new Part();
					p._id = counterDoc.seq;
					p.No = req.PartNo;
					p.Desc = req.PartDesc;
					p.Cost = 0;
					p.Price = 0;
					p.Models.push(modelObj);

					p.save(function (partError, newPartDoc) {
						if(partError) throw partError;
						res("New Part Doc was created...", newPartDoc);
					});
					
				});	
			}	
			GenNextId("Parts");	
		}else {	
			//return console.log("THIS IS WHAT DOC IS:",doc);
			if(getIndexIfObjWithOwnAttr(partDoc.Models, "ModelNo", req.ModelNo) > -1) {
				res("Part and ModelId already exists in Parts DB...", partDoc);
			}else {
				partDoc.Models.push(modelObj);
				partDoc.save(function (finalError, newPartDoc) {
					if(finalError) throw finalError;
					res("Part already exists, BUT NEW MODEL ADDED...", newPartDoc);
				});
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

exports.dropParts = function (res) {
	Part.remove({}, function (err) {
		res("Parts collection was dropped.");
	});
}


//THIS IS JUST TO CREATE A NEW COUNTER DOC...OR RESET IT TO ZERO
exports.initCounter = function (req, res) {
	Counter.findOne({_id: "Parts"}, function (err, doc) {

		if(doc == null) {
			var c = new Counter();
			c._id = "Parts";
			c.seq = 0;
			c.save(function (error) {
				console.log("New counter doc saved!!!", doc);
			});
		}else {
			doc.seq = 0;
			doc.save(function (error, newDoc) {
				if(error) { console.log(error); }
				console.log("Part Counter was reset to 0: ", newDoc);
			});
		}
	});
}








