var User = require('../models/user');
var Bcrypt = require('bcrypt');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

exports.postUser = function (req, res) {
	console.log("This is User REQ.BODY----", req.body);

	var Hash = Bcrypt.hashSync(req.body.Password, 10);

	var u = new User(); 
	u.Name = req.body.Name;
	u.Email = req.body.Email;
	u.Password = Hash;
	u.IsAdmin = req.body.IsAdmin;
	u.IsActive = true;
	
	u.save(function (err, user) {
		if(err) {
			console.log("Error saving new User---", err);
		}
		console.log(user);
		res.json(user);
	});

}
 
exports.getUsers = function (req, res) {
	User.find({}, function (err, users) {
		console.log(users);
		res.json(users);
	});
}

exports.getUser = function (req, res) {
	var UserId = req.params.id;
	//console.log("REQ PARAMS ID", req.params.id);
	User.findById({_id: req.params.id}, function (err, user) {
		if(err) {
			//console.log("Error finding by UserId", err);
		}else {
			//console.log("Successfully found User--", user);
			res.json({user: user, loggedIn: true});	
		}
	});
}

var isValidPassword = function (user, password) {
	//console.log(user, password);
	return Bcrypt.compareSync(password, user.Password);
}


exports.postLogin = function (req, res, next) {
	User.findOne({Email: req.body.Email}, function (err, user) {
		if(err) { console.log(err); }
		if(user == null) {
			res.json({Username: false});
			console.log("Wrong Email");
		}else if(!isValidPassword(user, req.body.Password)) {
			res.json({Login: false});
			console.log("Wrong password");
		}else {
			res.json(user);
			console.log("Successfully logged in.");
		}
	});
}

exports.updateUser = function (req, res) {
	console.log("req.params", req.params.email);
	if(req.body.Activate) {
		console.log("DeActivate req.body:", req.body);
		User.findOne({Email: req.params.email}, function (err, user) {
			console.log("THIS IS USER FROM DB:", user);
			if(err) {
				console.log("Error on finding the User", err)
			}else {
				user.IsActive = true;
				user.save(function (error) {
					if(error) throw error;
					console.log(user);
					res.json(user.IsActive);
				});
			}
		});
	}else if(req.body.DeActivate) {
		console.log("DeActivate req.body:", req.body);
		User.findOne({Email: req.params.email}, function (err, user) {
			console.log("THIS IS USER FROM DB:", user);
			if(err) {
				console.log("Error on finding the User", err)
			}else {
				user.IsActive = false;
				user.save(function (error) {
					if(error) throw error;
					console.log(user);
					res.json(user.IsActive);
				});
			}
		});
	}else if(req.body.OldPassword) {
		User.findOne({Email: req.params.email}, function (err, user) {
			if(err) {
				console.log("Error on finding the User", err);
			}else {
				var OldP = req.body.OldPassword;
				var PasswordsMatch = Bcrypt.compareSync(OldP, user.Password);
				if(PasswordsMatch) {
					console.log("Old Password is: ", OldP);
					var NewP = req.body.NewPassword;
					var Hash = Bcrypt.hashSync(NewP, 10);
					user.Password = Hash;
					user.save(function (error) {
						if(error) throw error;
						console.log("USER WAS UPDATED! USER IS: ", user);
						res.json({UpdatedUser: user});
					});
				}else {
					console.log("Password doesnt match whats on file, try again! ");
					res.json({UpdatedUser: false});
				}
			}
		});
	}else {
		var NP = req.body.NewPassword;
		User.findOne({Email: req.params.email}, function (err, user) {
			if(err) {
				console.log("Error on finding the User", err);
			}else {	
				var Hash = Bcrypt.hashSync(NP, 10);
				user.Password = Hash;
				user.save(function (error) {
					if(error) throw error;
					res.json(true);
				});
			}
		});
	}
}

exports.deleteUser = function (req, res) {
	User.findByIdAndRemove(req.params.id, function (err) {
		if(err) {
			console.send(err);
		}else {
			res.json({ message: "User Deleted."});
		}
	});
}










