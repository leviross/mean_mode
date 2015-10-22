angular.module('MCS_ServiceApp')
.controller('UserController', ['$scope', 'UserService', '$location', function ($scope, UserService, $location) {
	
	$scope.UserDetails = UserService.GetUser();

	$scope.UpdateUserPassword = function (email, oldpassword, newpassword1, newpassword2) {
		if(newpassword1 !== newpassword2) {
			alert("New passwords do not match, try again.");
		}else {
			var objToPass = { Email: email, OldPassword: oldpassword, NewPassword: newpassword1}
			UserService.UpdateDbPassword(objToPass);
		}
		this.NewPassword1 = "";
		this.NewPassword2 = "";
		this.OldPassword = "";
		this.UserSettingsForm.$setPristine();
	}

	$scope.BackToDashboard = function () {
		$location.path('/#/dashboard');
	}



}]);