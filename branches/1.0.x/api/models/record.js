var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var RecordModel = new mongoose.Schema({
	_id: Number,
	ParentId: Number,
	Children: Array,
	JobId: Number,//This is for importing only, were I had to save the old JobId to check which ones were already imported, so there no duplicates. 
	Paid: Boolean,
	Type: String,
	IsComplete: Boolean, 
	Requester: String,
	WorkOrderNo: String,
	ServicePlan: String,
	ServicePlanExp: String,
	Problem: String,
	PO: String,
	ClaimNo: String,
	PaymentType: String,
	TaxRate: String, 
	Backup: Boolean,
	BackupText: String,
	CompleteInfo: Object,
	Contact: Object,
	Assets: Array,
	Parts: Array,
	TechNotes: Array,
	DateCreated: String,
	DateModified: String
}, { collection: 'record' });


module.exports = mongoose.model('Record', RecordModel);