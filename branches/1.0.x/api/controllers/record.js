var Record = require('../models/record');
var Counter = require('../models/counter');
var Contact = require('../models/contact');
var District = require('../models/district');
var nodemailer = require('nodemailer');

exports.postRecord = function (req, res) {
	console.log("This is REQ.BODY: ", req.body);

	function GenNextId (records) {
		var query = { _id: records };
		var update = { $inc: { seq: 1} };
		//var options = { new: true };
		Counter.findOneAndUpdate(query, update, function (err, doc) {
			if(err) {
				console.log(err);
			}
			//console.log("Current seq # is: ", doc.seq);
			
			var r = new Record();
			r._id = doc.seq;
			r.ParentId = req.body.ParentId;
			r.Children = [];
			r.JobId = req.body.JobId;
			r.Paid = req.body.Paid;
			r.Type = req.body.Type;
			r.IsComplete = req.body.IsComplete; 
			r.Requester = req.body.Requester;
			r.WorkOrderNo = req.body.WorkOrderNo;
			r.ServicePlan = req.body.ServicePlan;
			r.ServicePlanExp = req.body.ServicePlanExp;
			r.Problem = req.body.Problem;
			r.PO = req.body.PO;
			r.ClaimNo = req.body.ClaimNo;
			r.PaymentType = req.body.PaymentType;
			r.TaxRate = req.body.TaxRate;
			r.Backup = req.body.Backup;
			r.BackupText = req.body.BackupText;
			r.CompleteInfo = req.body.CompleteInfo;
			r.Contact = req.body.Contact;
			r.Assets = req.body.Assets;
			r.Parts = req.body.Parts;
			r.TechNotes = req.body.TechNotes;
			r.DateCreated = new Date().toLocaleString();
			r.DateModified = new Date().toLocaleString();

			r.save(function (error) {
				if(error) {
					console.log("Error on the Server: ", error)
					res.send(error);
				}else {
					console.log("This is the new document:", r);
					res.json(r);
				}
			});
		});
	}

	GenNextId("Records");

}

exports.postNewDistrictOrder = function (req, res) {
	Contact.findOne({Company: req.body.School.name}, function (err, contact) {
		if(err) { console.log(err); }

		contact.Email = req.body.Email;
		contact.Phone1 = req.body.Phone;
		contact.NameFirst = req.body.NameFirst;
		contact.NameLast = req.body.NameLast;
		contact.Address2 = req.body.RoomNo;

		function GenNextId (records) {
			var query = { _id: records };
			var update = { $inc: { seq: 1} };
			//var options = { new: true };
			Counter.findOneAndUpdate(query, update, function (counterError, doc) {
				if(counterError) {
					console.log(counterError);
				}
				
				var r = new Record();
				r._id = doc.seq;
				r.Type = req.body.Type;
				r.Requester = "Website";
				r.WorkOrderNo = req.body.WorkOrderNo;
				r.Problem = req.body.Problem;
				r.Contact = contact;
				r.Assets.push({AssetTag: req.body.AssetTag, SerialNo: req.body.SerialNo, ModelName: req.body.ModelName, ModelNo: "", Brand: req.body.Brand.name});
				r.DateCreated = new Date().toLocaleString();
				r.DateModified = new Date().toLocaleString();

				r.save(function (error) {
					if(error) {
						console.log("Error on the Server: ", error);
						res.send(error);
					}else {
						console.log("This is the new document:", r);
						res.json(r);
					}
				});
			});
		}

		GenNextId("Records");

	});
}

exports.getRecord = function (req, res) {
	var RecId = req.params.id;
	Record.findById(RecId, function (err, doc) {
		if(err) {
			console.log("Error finding GETRECORD on server side:", err);
			res.send(err);
		}else {
			//console.log("REQ.SESSION:", req);
			//console.log("REQ.USER:", req);
			res.json(doc);
		}
	})
}

exports.getRecordByWorkNo = function (req, res) {
	Record.findOne({WorkOrderNo: {$regex: '^'+req.params.id+'$', $options: 'gi'}}, function (err, doc) {
		if(err) { console.log(err); }
		console.log(doc);
		res.json(doc);
	});
}

exports.getDistrictRecentRecs = function (req, res) {

	Record.find({Type: req.params.district}).sort('-_id').limit(5).exec(function (err, docs) {
		if(err) { console.log(err); }

		console.log(docs);
		res.json(docs);

	});
}

exports.putParentRec = function (req, res) {
	// return console.log(req.body);
	Record.findById(req.params.id, function (err, doc) {
		if(err) { console.log(err); }
		
		doc.Children.push(req.body.ChildId);
		doc.markModified('Children');
		doc.save(function (error, updatedDoc) {
			if(error) { console.log(updatedDoc); }

			console.log(updatedDoc);
			res.json(updatedDoc);
		});
	});
}

exports.getRecordByAssets = function (req, res) {	
	var assetTag = req.body.AssetTag;
	var serialNo = req.body.SerialNo;

	if(serialNo != "" && serialNo != undefined) {
		Record.findOne({'Assets': {$elemMatch: {SerialNo: {$regex: '^'+serialNo+'$', $options: 'i'}}}}, function (err, doc) {
		if(err) { console.log(err); }
		console.log(doc);
		res.json(doc);
	});
	}else {
		Record.findOne({'Assets': {$elemMatch: {AssetTag: {$regex: '^'+assetTag+'$', $options: 'i'}}}}, function (err, doc) {
			if(err) { console.log(err); }
			console.log(doc);
			res.json(doc);
		});
	}
}

exports.putRecord = function (req ,res) {
	Record.findById(req.params.id, function (err, r) {
		if(err) {
			console.log("Error finding PUTRECORD on server side:", err);
			res.send(err);
		}else {
			r.ParentId = req.body.ParentId;
			r.Paid = req.body.Paid;
			r.Type = req.body.Type;
			r.IsComplete = req.body.IsComplete; 
			r.Requester = req.body.Requester;
			r.WorkOrderNo = req.body.WorkOrderNo;
			r.ServicePlan = req.body.ServicePlan;
			r.ServicePlanExp = req.body.ServicePlanExp;
			r.Problem = req.body.Problem;
			r.PO = req.body.PO;
			r.ClaimNo = req.body.ClaimNo;
			r.PaymentType = req.body.PaymentType;
			r.TaxRate = req.body.TaxRate;
			r.Backup = req.body.Backup;
			r.BackupText = req.body.BackupText;
			r.CompleteInfo = req.body.CompleteInfo;
			r.Contact = req.body.Contact;
			r.Assets = req.body.Assets;
			r.Parts = req.body.Parts;
			r.TechNotes = req.body.TechNotes;
			r.DateModified = new Date().toLocaleString();

			r.save(function (error, record) {
				if(error) throw error;
				res.json(record);
				console.log("Updated Record:", record);
			});
		}
	});
}

exports.sendCompleteEmail = function (req, res) {
	var record = req.body;

	District.findOne({Name: req.body.Type}, function (err, doc) {
		//return console.log(req.body.Type)

		if(err) console.log(err);
		var template = doc.EmailTemplate;
		//replace all the < > charachters and then replace each variable to the matching field
		template = template.replace(/[<>]/g, "");
		template = template.replace(/technician/gi, record.CompleteInfo.RepairedBy);
		template = template.replace(/jobnumber/gi, record._id);
		template = template.replace(/actiontaken/gi, record.CompleteInfo.ActionNotes);
		template = template.replace(/lastname/gi, record.Contact.NameLast);
		template = template.replace(/firstname/gi, record.Contact.NameFirst);
		template = template.replace(/company/gi, doc.FullName);
		template = template.replace(/workorder/gi, record.WorkOrderNo);

		var transporter = nodemailer.createTransport({
			service: "Gmail",
			auth: {
				user: "levross",
				pass: ""
			}
		});

		var mailOptions = {
			from: "test@test.com",
			to: "levross@gmail.com",
			subject: "testing mailer",
			text: template,
			html: ""
		}

		transporter.sendMail(mailOptions, function (err, info) {
			if(err) console.log(err);
			console.log("Message sent: " + info.response);
			res.json(info);
		});

		//send response back to client when done ...

		// console.log(template);
		// res.json(template);

	});

}

exports.updateTechNotes = function (req ,res) {
	Record.findById(req.params.id, function (err, r) {
		if(err) {
			console.log("Error finding that record on the server side:", err);
			res.send(err);
		}else {
			r.TechNotes = req.body.TechNotes;
			r.DateModified = new Date().toLocaleString();

			r.save(function (error, record) {
				if(error) throw error;
				res.json(record);
				//console.log("Updated Record:", record);
			});
		}
	});
}

exports.deleteRecord = function (req, res) {
	Record.findByIdAndRemove(req.params.id, function (err) {
		if(err) {
			console.log(err);
		}else {
			res.json({ message: 'Record deleted.' });
		}
	});
}

exports.updateJob = function (req, res) {
	Record.find({JobId: req.params.id}, function (err, record) {
		if(err) {
			console.log(err);
		}
		record.Parts = req.body.Part;

		record.save(function (error, record) {
			if(error) {
				console.log(error);
			}else {
				console.log("Updated Record Successfully: ", record);
				res.json(record);
			}

		});	
	});
}

exports.resetCounter = function (req, res) {
	var count = new Counter();
	count.seq = 0;
	count._id = "Records";

	count.save(function (err) {
		if(err) {
			console.log(err);
		}else {
			console.log(count);
			res.json(count);
		}
	});

}

// exports.resetCounter = function (req, res) {
// 	Counter.remove({}, function (err) {
// 		console.log("Counter Model was dropped.");
// 	})
// }

exports.dropRecords = function (req, res) {
	Record.remove({}, function (err) {
		console.log("Record model was dropped");
	});
}




