var Record = require('../models/record');
var Counter = require('../models/counter');
var http = require('http');

exports.postRecord = function (req, res) {//NOT USING THIS, JUST FOR REFERENCE. 
	console.log("This is REQ.BODY: ", req.body);

	function GenNextId (happy) {
		var query = { _id: happy };
		var update = { $inc: { seq: 1} };
		//var options = { new: true };
		Counter.findOneAndUpdate(query, update, function (err, doc) {
			if(err) {
				console.log(err);
			}
			//console.log("Current seq # is: ", doc.seq);
			
			var r = new Record();
			r._id = doc.seq;
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
			r.Labors = req.body.Labors;
			r.DateCreated = req.body.DateCreated;
			r.DateModified = null;

			r.save(function (error) {
				if(error) {
					console.log("Error on the Server: ", error)
					res.send(error);
				}else {
					//console.log("NEW RECORD:", r);
					res.json(r);
				}
			});
		});
	}

	GenNextId("Records");

}

exports.putRecord = function (req ,res) {
	Record.findById(req.params.id, function (err, r) {
		if(err) {
			console.log("Error finding that record on the server side:", err);
			res.send(err);
		}else {
			r.Paid = req.body.Paid;
			r.Type = req.body.Type;
			r.IsComplete = req.body.IsComplete; 
			r.Requester = req.body.Requester;
			r.WorkOrderNo = req.body.WorkOrderNo;
			r.ServicePlan = req.body.ServicePlan;
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
			r.Labors = req.body.Labors;
			r.DateModified = new Date().toLocaleString();

			r.save(function (error, record) {
				if(error) throw error;
				res.json(record);
				console.log("Updated Record:", record);
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

exports.updateParts = function (req, res) {
	var jobId = (parseInt(req.JobId) + 6000); //ADD 6000 FOR RETAIL AND LABOR PARTS
	//var jobId = parseInt(req.JobId);
	//return console.log(req);
	var query = {_id: jobId};
	delete req.JobId;
	
	var update = { 
		$push: { Parts: req}, 
		DateModified: new Date().toLocaleString()
	};
	var options = { new: true };
	
	Record.findOneAndUpdate(query, update, options, function (err, r) {
		if(err) {
			console.log("Error finding that record on the server side:", err);
			res(err);
		}else { 		
			//console.log("Updated Record:", r);	
			res(r);		
		}
	});
}

exports.sendTechNotes = function (req, res) {
	//We have to add 6000 to every JobId because for some messed up reason, the technotes were saved as 1001 in place of 7001 in FileMaker
	var jobId = (parseInt(req.JobId) + 6000);
	
	var query = {_id: jobId};
	delete req.JobId;

	Record.findOne(query, function (err, r) {
		if(err) {
			res(err);
		} 

		r.TechNotes.push(req);

		r.save(function (error) {
			if(error) throw error;
			res(r);
		});
	
	});
}

exports.sendCompleteDate = function (req, res) {
	var JobId = req.JobId;
	var query = {JobId: JobId};
	var update = {'CompleteInfo.Date': req.DateCompleted};
	var options = {new: true};

	Record.findOneAndUpdate(query, update, options, function (err, r) {
		if(err) {
			console.log(err);
			res(err);
		}else {
			res(r);
		}
	});
}

exports.postNewRecord = function (req, res) {
	//console.log("This is REQ: ", req);
	
	//ITS STILL CREATEING AN OBJECT ID FOR SOME REASON
	var r = new Record();
	r._id = req.JobId;
	r.ParentId = req.ParentId;
	r.Children = r.Children;
	r.Paid = req.Paid;
	r.Type = req.Type;
	r.IsComplete = req.IsComplete; 
	r.Requester = req.Requester;
	r.WorkOrderNo = req.WorkOrderNo;
	r.ServicePlan = req.ServicePlan;
	r.ServicePlanExp = req.ServicePlanExp;
	r.Problem = req.Problem;
	r.PO = req.PO;
	r.ClaimNo = req.ClaimNo;
	r.PaymentType = req.PaymentType;
	r.Backup = req.Backup;
	r.BackupText = req.BackupText;
	r.CompleteInfo = req.CompleteInfo;
	r.Contact = req.Contact;
	r.Assets = req.Assets;
	r.Parts = req.Parts;
	r.TechNotes = req.TechNotes;
	r.DateCreated = req.DateCreated;
	r.DateModified = req.DateModified;

	r.save(function (error) {
		if(error) {
			console.log("Error on the Server: ", error);
			res(error);
		}else {
			//console.log("NEW RECORD:", r);
			res(r);
		}
	});
	

	

}








