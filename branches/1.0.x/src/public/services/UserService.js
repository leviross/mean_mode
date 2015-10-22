app.factory('UserService', ['$http', '$location', 'Globals', function ($http, $location, Globals) {

	var _User = null;
	var Users = [];
	var apiUri = Globals.ApiUri();
	var webServerUri = Globals.WebServerUri();

	return {

		LoadUser: function (id, callback) {
			//console.log(id);
			$http.get(apiUri + '/api/users/' + id)
			.success(function (data) {
				if(data.loggedIn) {
					_User = data.user;
					console.log("This is the data from UserService LoadUser", _User);
				}else {
					_User = null;
				}
				callback(data);
			})
			.error(function (err) {
				callback(err);
			});
		},
		GetAllUsers: function (callback) {
			if(Users.length == 0) {
				$http.get(apiUri + '/api/users')
				.success(function (usersArray) {
					callback(usersArray);
					Users.push(usersArray);
				})
				.error(function (err) {
					console.log(err);
				});
			}else {
				callback(Users[0]);
			}	
		},
		Login: function (user) {
			_User = user;
		},
		Logout: function () {
			$http.post(webServerUri + '/endsession')
			.then(function (retval) {
				_User = null; 
				var url = "http://localhost:3030/login.html";
				window.location = url;
			}, function (err) {
				console.log(err);
			});
		},
		IsLoggedIn: function () {
			return (_User == null) ? false : true;
			console.log(_User);
		}, 
		GetUser: function () {
			return _User;
		},
		GetSessionUser: function (callback) {
			$http.get(webServerUri + '/getuser')
            .then(function (retval) {
                callback(retval.data);
            }, function (err) {
                console.log(err);
            });
		},
		UpdateDbPassword: function (objToPass, callback) {
			$http.put(apiUri + '/api/users/' + objToPass.Email, objToPass)
			.success(function (updatedUser) {
				alert("Updated successfully!");
				console.log("Updated successfully: ", updatedUser);	
				callback(updatedUser);				
			})
			.error(function (err) {
				console.log(err);
			});
		},
		CreateNewUser: function (newUserObj) {
			$http.post(apiUri + '/api/users', newUserObj)
			.success(function (retval) {
				alert("Created successfully!");
				console.log(retval);
			})
			.error(function (err) {
				console.log(err);
			});
		},
		DeActivateUser: function (email, callback) {
			var objToPass = {DeActivate: true}
			$http.put(apiUri + '/api/users/' + email, objToPass)
			.success(function (deactived) {
				if(deactived) {
					alert("User has been deactived!");
					console.log(deactived);
				}else {
					alert("That didnt work for some reason, tell this to Mike!");
				}
				callback(deactived);
			})
			.error(function (err) {
				console.log(err);
			});
		}, 
		ActivateUser: function (email, callback) {
			var objToPass = {Activate: true}
			$http.put(apiUri + '/api/users/' + email, objToPass)
			.success(function (activated) {
				if(activated) {
					alert("User has been activated!");
					console.log(activated);
				}else {
					alert("That didnt work for some reason, tell this to Mike!");
				}
				callback(activated);
			})
			.error(function (err) {
				console.log(err);
			});
		}

	}

}]);