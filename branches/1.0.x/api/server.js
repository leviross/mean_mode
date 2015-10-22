var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var app = express();

app.use(bodyParser.urlencoded({ extended: true }));//true does a serialization/deserialization algorithm that supports nested data structures
// parse application/json
app.use(bodyParser.json());
app.use(cors());


var port = process.env.PORT || 4000;
var router = express.Router();


var mongoose = require('mongoose');
mongoose.connect('mongodb://magicdbadmin:magicdbadminpassword@192.168.50.21:27017/magicdb', function (err){
	if(err) {
		console.log(err);
	}
});

var contactCtrl = require('./controllers/contact');
var userCtrl = require('./controllers/user');
var recordCtrl = require('./controllers/record');
var settingsCtrl = require('./controllers/settings');
var modelCtrl = require('./controllers/model');
var assetCtrl = require('./controllers/asset');
var partCtrl = require('./controllers/part');
var districtCtrl = require('./controllers/district');

// contacts
router.route('/contacts')
	.post(contactCtrl.postContact)
	.get(contactCtrl.getContacts);
//get single contact or update or delete
router.route('/contacts/:id')
	.get(contactCtrl.getContactById)
	.put(contactCtrl.putContact)
	.delete(contactCtrl.deleteContact);
//these following routes are for search input fields 
router.route('/contacts/firstname/:FirstName')
    .get(contactCtrl.getContactByFirstName);

router.route('/contacts/lastname/:LastName')
    .get(contactCtrl.getContactByLastName);

router.route('/contacts/company/:Company')
    .get(contactCtrl.getContactByCompany);

router.route('/contacts/fullname/:FullName')
    .get(contactCtrl.getContactByFullName);

router.route('/contacts/allfields/:AllFields')
    .get(contactCtrl.getContactByAllFields);

router.route('/contacts/anyfield/:AnyField')
    .get(contactCtrl.getContactByAnyFields);

router.route('/contacts/types/:Type')
	.get(contactCtrl.getContactByType);    

//users get all or create   
router.route('/users')
	.get(userCtrl.getUsers)
	.post(userCtrl.postUser);
//update user via their email	
router.route('/users/:email')
	.put(userCtrl.updateUser);	
//get single or delete	
router.route('/users/:id')
	.get(userCtrl.getUser)
	.delete(userCtrl.deleteUser);

//records - create
router.route('/records')
	.post(recordCtrl.postRecord);
//district order creation
router.route('/records/district-order')
	.post(recordCtrl.postNewDistrictOrder);	
//single record, get update or delete
router.route('/records/:id')
	.get(recordCtrl.getRecord)
	.put(recordCtrl.putRecord)
	.delete(recordCtrl.deleteRecord);	
//these routes pull records by a certain criteria 
router.route('/records/workorderno/:id')
	.get(recordCtrl.getRecordByWorkNo);	

router.route('/districts/recent-records/:district')
	.get(recordCtrl.getDistrictRecentRecs);

router.route('/records/assets/:id')
	.put(recordCtrl.getRecordByAssets);	
	
router.route('/jobs/:id')
	.put(recordCtrl.updateJob);	

router.route('/technotes/:id')
	.put(recordCtrl.updateTechNotes);

router.route('/records/parents/:id')
	.put(recordCtrl.putParentRec);	

//parts
router.route('/parts')
	.put(partCtrl.createPart);

router.route('/parts/:id')
	.get(partCtrl.getPartById)
	.put(partCtrl.putPartById)
	.delete(partCtrl.deletePartById);	

router.route('/parts/no/:partno')
	.get(partCtrl.getPartNos);

router.route('/parts/desc/:partdesc')
	.get(partCtrl.getPartDesc);

//assets
router.route('/assets/serialnos/:serialno')
	.get(assetCtrl.getSerialNos);	

router.route('/assets/tagnos/:tagno')
	.get(assetCtrl.getTagNos);	

//models	
router.route('/models/modelno/:modelno')//exact model no match...
	.get(modelCtrl.getModelNo);	
	
router.route('/models/brands/:brand')
	.get(modelCtrl.getModelsByBrand);	

router.route('/models')
	.post(modelCtrl.postModels)
	.get(modelCtrl.getAllModels);

router.route('/models/modelnos/:modelno')//this returns partial model no matches...
	.get(modelCtrl.getModelNos);	

router.route('/models/:id')
	.get(modelCtrl.getModelById)
	.put(modelCtrl.putModelById)
	.delete(modelCtrl.deleteModelById);	

//districts
router.route('/districts')
	.get(districtCtrl.getAllDistricts)
	.post(districtCtrl.postDistrict);

router.route('/districts/:id')
	.put(districtCtrl.putDistrict)
	.delete(districtCtrl.deleteDistrict);

//emails
router.route('/emails')
	.post(recordCtrl.sendCompleteEmail);	
	
//reset record counter to 0
router.route('/counter/records/:id')
	.put(recordCtrl.resetCounter);
//Drop record collection
router.route('/droprecords')
	.put(recordCtrl.dropRecords);
//reset contact counter to 4075
router.route('/counter/contacts/:id')
	.put(contactCtrl.initCounter);			
//login	
router.route('/login')
	.post(userCtrl.postLogin);
	
router.route('/districtlogin')
	.post(contactCtrl.postLogin);	

//settings
router.route('/settings/:name')
	.get(settingsCtrl.getSetting)
	.put(settingsCtrl.putSetting);

router.route('/settings')
	.get(settingsCtrl.getSettings)
	.post(settingsCtrl.postSetting);		
	
router.route('/settings/:id')
	.delete(settingsCtrl.deleteSetting);

router.get('/', function(req, res){
	res.send('Here we go!');
});

app.use('/api', router);
app.listen(port);
console.log('Listening on port 4000');