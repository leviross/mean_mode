app.factory('DistrictService', ['$http', 'Globals', function ($http, Globals) {
	var _District = ""; 
	var _User = null;
	var apiUri = Globals.ApiUri();
	var webServerUri = Globals.WebServerUri();

	return {
		SetCurrentDistrict: function (district) {
			_District = district;
		},
		GetCurrentDistrict: function () {
			return _District;
		},
		Login: function (user) {
			_User = user;
		},
		IsLoggedIn: function () {
			return (_User == null) ? false : true;
			console.log(_User);
		}, 
		Logout: function () {
			$http.post(webServerUri + '/endsession')
			.then(function (retval) {
				_User = null; 
				var url = webServerUri + "/district-login.html";
				window.location = url;
			}, function (err) {
				console.log(err);
			});
		},
		GetUser: function () {
			return _User;
		},
		GetAllDistricts: function (callback) {
			return $http.get(apiUri + '/api/districts')
			.then(function (retval) {
				callback(retval.data);
			}, function (err) {
				console.log(err);
			});
		},
		GetRecentRecs: function (district, callback) {
			return $http.get(apiUri + '/api/districts/recent-records/' + district)
			.success(function (retval) {
				callback(retval);
			})
			.error(function (err) {
				console.log(err);
			});
		},
		CreateNewDistrict: function (district, callback) {
			return $http.post(apiUri + '/api/districts', district)
			.then(function (retval) {
				callback(retval.data);
			}, function (err) {
				console.log(err);
			});

		},
		EditDistrictName: function (district, callback) {
			return $http.put(apiUri + '/api/districts/' + district._id, district)
			.then(function (retval) {
				callback(retval.data);
			}, function (err) {
				console.log(err);
			});
		},
		AddContactToDistrict: function (districtId, contact, callback) {
			return $http.put(apiUri + '/api/districts/' + districtId, contact)
			.then(function (retval) {
				callback(retval.data);
			}, function (err) {
				console.log(err);
			});
		},
		UpdateDistrict: function (district, callback) {
			return $http.put(apiUri + '/api/districts/' + district._id, district)
			.then(function (retval) {
				callback(retval.data);
			}, function (err) {
				console.log(err);
			});
		},
		DeleteDistrict: function (id, callback) {
			return $http.delete(apiUri + '/api/districts/' + id)
			.then(function (retval) {
				callback(retval);
			}, function (err) {
				console.log(err);
			});
		}


	}


}]);