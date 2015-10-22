var Contact = require('../models/contact');
var Counter = require('../models/counter');
var Bcrypt = require('bcrypt');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

exports.postContact = function (req, res){
	console.log("REQ.BODY: ", req.body);
	//MongoDB does not support sequential ID's so you have to create a new document and update its value
	//then save that as our id
	function GenNextId (whocares) {
		var query = { _id: whocares };
		var update = { $inc: { seq: 1} };
		var options = { new: true };
		Counter.findOneAndUpdate(query, update, options, function (err, doc) {
			if(err) {
				console.log("Error on updating Id", err);
			}

			if(req.body.Password != undefined && req.body.Password != "") {
	    		var passwordToSave = Bcrypt.hashSync(req.body.Password, 10);
	    	}else {
	    		var passwordToSave = "";
	    	}

			var c = new Contact();
		    c._id = doc.seq, //save updated counter document as our id 
			c.Address = req.body.Address;
			c.Address2 = req.body.Address2;
			c.City = req.body.City;
			c.State = req.body.State;
			c.Zip = req.body.Zip;
			c.NameFirst = req.body.NameFirst;
			c.NameLast = req.body.NameLast;
			c.Company = req.body.Company;
			c.Email = req.body.Email;
			c.Password = passwordToSave;
			c.Phone1 = req.body.Phone1;
			c.Phone2 = req.body.Phone2;
			//c.Type = req.body.type;//Figure out what do to with new Contact type!! 
			c.TypeDisplay = req.body.TypeDisplay;
			c.DateCreated = new Date().toLocaleString();
			c.DateModified = null;

			c.save(function (error){
				if(error){
					res.send(error);
				}else{
					console.log(c);
					res.json({ contact: c });
				}
			});
		});	
	}	

	GenNextId("Contacts");

}

var isValidPassword = function (contact, password) {
	return Bcrypt.compareSync(password, contact.Password);
}

exports.postLogin = function (req, res) {
	Contact.findOne({Email: req.body.Email}, function (err, contact) {
		if(err) { console.log(err); }
		if(contact == null) {
			res.json(null);
			console.log("Wrong Email");
		}else if(!isValidPassword(contact, req.body.Password)) {
			res.json(null);
			console.log("Wrong password");
		}else {
			res.json(contact);
			console.log("Successfully logged in.");
		}
	});
}

//THIS IS JUST TO CREATE A NEW COUNTER DOC...SET IT TO WHATEVER # IS AFTER LAST CONTACT RECORD
exports.initCounter = function (req, res) {
	Counter.findOne({_id: "Contacts"}, function (err, doc) {
		console.log(doc);
		if(doc == null) {
			var c = new Counter();
			c._id = "Contacts";
			c.seq = 4075; // TODO: find out which num to initialize to...
			c.save(function (error, newDoc) {
				console.log("New counter doc saved!!!", newDoc);
			});
		}
	});
}

exports.getContactById = function (req, res) {
	Contact.findById(req.params.id, function (err, doc) {
		if(err) { console.log(err); }
		console.log(doc);
		res.json(doc);
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

exports.getContactByFirstName = function (req, res) {
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

exports.getContactByLastName = function (req, res) {
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

exports.getContactByCompany = function (req, res) {
	console.log("COMPANY!!!", req.params.Company);
	Contact.find( {Company: {$regex: req.params.Company, $options: 'mi' } }, function (err, contacts) {
		if(err) {
			res.send(err);
		}else {
			res.json(contacts);
			contacts.map(function (contact) {
				console.log(contact);	
			});
		}
	});
}

exports.getContactByFullName = function (req, res) {
	var FullNameArr = req.params.FullName.split(" ");
	console.log(FullNameArr);
	Contact.find( {NameFirst: {$regex: '^'+FullNameArr[0]+'$', $options: 'i'}, NameLast: {$regex: '^'+FullNameArr[1], $options: 'mi'} }, function (err, contacts) {
		if(err) {
			res.send(err);
		}else {
			res.json(contacts);
			console.log(contacts);
		}
	});
}
 
exports.getContactByAllFields = function (req, res) {
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

exports.getContactByAnyFields = function (req, res) {
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

exports.getContactByType = function (req, res) {
	var finalArr = [];
	Contact.find({Type: req.params.Type}, function (err, docs) {
		if(err) { console.log(err); }
		//Take the array of matched docs, and then make a new array of all the unique Companys
		docs.forEach(function (contact) {
			if(finalArr.indexOf(contact.Company) == -1 && contact.Company != "") {
				finalArr.push(contact.Company);
			}
		});
		res.json(finalArr);
		console.log(finalArr);
	});
}

exports.putContact = function (req, res) {
	console.log("THIS IS REQ.BODY____",req.body);
	delete req.body._id;
	

    Contact.findById(req.params.id, function (err, contact) {
    	if(err) throw err;		

    	if(req.body.Password != undefined && req.body.Password != "") {
    		var passwordToSave = Bcrypt.hashSync(req.body.Password, 10);
    	}else if(contact.Password.length > 15) {
    		var passwordToSave = contact.Password;
    	}else {
    		var passwordToSave = "";
    	}

		contact.Address = req.body.Address;
		contact.Address2 = req.body.Address2;
		contact.City = req.body.City;
		contact.State = req.body.State;
		contact.Zip = req.body.Zip;
		contact.NameFirst = req.body.NameFirst;
		contact.NameLast = req.body.NameLast;
		contact.Company = req.body.Company;
		contact.Email = req.body.Email;
		contact.Password = passwordToSave;
		contact.Phone1 = req.body.Phone1;
		contact.Phone2 = req.body.Phone2;
		contact.Type = req.body.Type;
		contact.DateModified = new Date().toLocaleString();

		contact.save(function (error, updatedContact) {
			if(error) throw error;
			res.json(updatedContact);
			console.log(updatedContact);
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