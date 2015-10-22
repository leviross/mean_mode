var Contact = require('../models/contact');
var Counter = require('../models/counter');

exports.postContact = function (req, res){

	Contact.findOne({OldId: req.OldId}, function (err, doc) {
		if(err) throw err;

		if(doc && doc.OldId == req.OldId) {
			res("doc.OldId === req.OldId")
		}else if(doc != null) {
			res("doc !== null")
		}else if(doc == null) {

			var c = new Contact();
		    c.OldId = req.OldId;
			c.Address = req.Address;
			c.Address2 = req.Address2;
			c.City = req.City;
			c.State = req.State;
			c.Zip = req.Zip;
			c.NameFirst = req.NameFirst;
			c.NameLast = req.NameLast;
			c.Company = req.Company;
			c.Email = req.Email;
			c.Password = "";
			c.Phone1 = req.Phone1;
			c.Phone1Type = req.Phone1Type;
			c.Phone2 = req.Phone2;
			c.Phone2Type = req.Phone2Type;
			c.Type = req.Type;
			c.DateCreated = req.DateCreated;
			c.DateModified = req.DateModified;

			c.save(function (error, newDoc) {
				if(error) {
					throw error;
				}else {
					res(newDoc);
				}
			});
				
		}

	});
		

}

//THIS IS JUST TO CREATE A NEW COUNTER DOC...
exports.initCounter = function (req, res) {
	Counter.findOne({_id: "sunshine"}, function (err, doc) {
		console.log(doc);
		if(doc == null) {
			var c = new Counter();
			c._id = "Contacts";
			c.seq = 4446; //Figure out what to init to...
			c.save(function (error, newDoc) {
				console.log("New counter doc saved!!!", newDoc);
			});
		}else {
			doc.seq = 0;
			doc.save(function (error, newDoc) {
				if(error) throw error;
				res(newDoc);
			});
		}
	});
}


exports.getContacts = function (req, res) {
    Contact.find(function (err, contacts) {
		if(err){
			res.send(err);
		}else{
			res.json(contacts);
		}
	});
}

exports.getContactFirstName = function (req, res) {
	console.log("THIS IS REQ.PARAMS", req.params.FirstName);
	Contact.find( { NameFirst: new RegExp('^'+req.params.FirstName+'$', 'i') }, function (err, contacts) {
		if(err){
			res.send(err);
		}else{
			res.json(contacts);
			console.log(contacts);
		}
	});
}

exports.getContactLastName = function (req, res) {
	console.log("LAST NAME!!!!!!!!!!", req.params.LastName);
	Contact.find( {NameLast: new RegExp('^'+req.params.LastName+'$', 'i') }, function (err, contacts) {
		if(err) {
			res.send(err);
		}else {
			res.json(contacts);
			console.log(contacts);
		}
	});
}

exports.getContactCompany = function (req, res) {
	console.log("COMPANY!!!", req.params.Company);
	Contact.find( {Company: {$regex: req.params.Company, $options: 'mi' } }, function (err, contacts) {
		if(err) {
			res.send(err);
		}else {
			res.json(contacts);
			contacts.map(function (contact) {
				console.log("Type:",contact.Type, "TypeDisplay:",contact.TypeDisplay);	
			});
		}
	});
}

exports.getContactFullName = function (req, res) {
	var FullNameArr = req.params.FullName.split(" ");
	console.log(FullNameArr);
	Contact.find( {NameFirst: {$regex: '^'+FullNameArr[0]+'$', $options: 'i'}, NameLast: {$regex: '^'+FullNameArr[1], $options: 'mi'} }, function (err, contacts) {
		if(err) {
			res.send(err);
		}else {
			res.json(contacts);
		}
	});
}
 
exports.getContactAllFields = function (req, res) {
	var AllFields = req.params.AllFields.split(" ");
	console.log(AllFields);
	Contact.find( {NameFirst: {$regex: '^'+AllFields[0]+'$', $options: 'i'}, NameLast: {$regex: '^'+AllFields[1], $options: 'i'}, Company: {$regex: '^'+AllFields[2], $options: 'mi'} }, function (err, contacts) {
		if(err) {
			res.send(err);
		}else {
			res.json(contacts);
			console.log(contacts);
		}
	});
}

exports.getContactAnyFields = function (req, res) {
	var AnyField = req.params.AnyField.split(" ");
	console.log(AnyField);
	if(AnyField.length == 1) {
		Contact.find().or([ {NameFirst: {$regex: '^'+AnyField[0], $options: 'i'}}, {NameLast: {$regex: '^'+AnyField[0], $options: 'i'}}, {Company: {$regex: '^'+AnyField[0], $options: 'i'}}]).limit(8).exec(function (err, contacts) {
			if(err) {
				res.send(err);
			}else {
				console.log(contacts);
				res.json(contacts);
			}
		});
	}else if(AnyField.length == 2) {
		 Contact.find().or([ {NameFirst: {$regex: '^'+AnyField[0]+'$', $options: 'i'}, NameLast: {$regex: '^'+AnyField[1], $options: 'i'}}, {Company: {$regex: '^'+req.params.AnyField, $options: 'mi'}}]).limit(8).exec(function (err, contacts) {
			if(err) {
				res.send(err);
			}else {
				console.log(contacts);
				res.json(contacts);
			}
		});
	}
}

exports.getContact = function (req, res) {
    Contact.findById(req.params.id, function (err, contact) {
		if(err){
			res.send(err);
		}else{
			res.json(contact);
		}
	});
}

exports.putContact = function (req, res) {
	console.log("THIS IS REQ.BODY____",req.body);
	delete req.body._id;
	//findByIdAndUpdate was not working proplery, I tried all different ways to pass the object, 
	//Had to use the method below
    Contact.findById(req.params.id, function (err, contact) {
    	if(err) throw err;		
		contact.Address = req.body.Address;
		contact.Address2 = req.body.Address2;
		contact.City = req.body.City;
		contact.State = req.body.State;
		contact.Zip = req.body.Zip;
		contact.NameFirst = req.body.NameFirst;
		contact.NameLast = req.body.NameLast;
		contact.Company = req.body.Company;
		contact.Email = req.body.Email;
		contact.Phone1 = req.body.Phone1;
		contact.Phone2 = req.body.Phone2;
		contact.TypeDisplay = req.body.TypeDisplay;
		contact.DateModified = new Date().toLocaleString();

		contact.save(function (err) {
			if(err) throw err;
			res.json(contact);
			console.log(contact);
		});
	});
}

exports.deleteContact = function (req, res) {
    Contact.findByIdAndRemove(req.params.id, function (err) {
		if(err){
			res.send(err);
		}else{
			res.json({ message: 'Contact deleted' });
		}
	});
}

exports.dropContacts = function (req, res) {
	Contact.remove({}, function () {
		res("Contact collection dropped");
	});
}






