var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var RecordModel = new mongoose.Schema({
	_id: Number,
	ParentId: Number,
	Children: Array,
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
	TaxRate: Number,
	Backup: Boolean,
	BackupText: String,
	CompleteInfo: Object,
	Contact: Object,
	Assets: Array,
	Parts: Array,
	TechNotes: Array,
	DateCreated: String,
	DateModified: String
}, {versionKey: false}, { collection: 'record' });


module.exports = mongoose.model('Record', RecordModel);