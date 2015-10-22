angular.module('MCS_ServiceApp')
.controller('TopNavController', ['$scope', '$rootScope', '$location', 'RecordService', 'UserService', 'Globals', function ($scope, $rootScope, $location, RecordService, UserService, Globals){

	$scope.RecordNo = "";		
	$scope.DisablePrev = false;
	$scope.DisableNext = false;
	$scope.User = UserService.GetUser();

	//On login or page reload, we have to pull the sessoin User obj in right away
	//Otherwise we wont know whether to display the nav or not! 
	if(!$scope.User) {
		UserService.GetSessionUser(function (user) {
			$scope.User = user;
			console.log($scope.User);
		});
	}
	

	$scope.$on('EnableNavButtons', function (event) {
		$scope.DisablePrev = false;
		$scope.DisableNext = false;
	});

	$scope.$on('DisableNavButtons', function (event) {
		$scope.DisablePrev = true;
		$scope.DisableNext = true ;
	});

	if($scope.RecordNo = "") {
		$scope.DisablePrev = true;
		$scope.DisableNext = true ;
	}

	$scope.NewRelatedRec = function () {
		$rootScope.$broadcast('NewRelatedRec', $scope.RecordNo);
	}

	$scope.GoToDashBoard = function () {
		var settingsArr = RecordService.GetSettingsArray();
		$rootScope.$broadcast('SaveTabBeforeClose');
		
		var notPristine = _.find(settingsArr, function (record) {
			return !record.Pristine;
		});

		if(notPristine != undefined) {
			CheckIfDiscardChanges();
		}else {
			$location.path('/dashboard');
		}
	}

	var CheckIfDiscardChanges = function () {
		var discardChanges = confirm("Are you sure you want to discard your changes?");
		if(discardChanges) {
			$location.path('/dashboard');
		}
	}
 
	$scope.Logout = function () {
		UserService.Logout();
	}

	$scope.NewRecord = function () {
		$scope.ShowRecordNavThing = true;
		Globals.SetRecordId(0);

		if($location.path('/records')) {
			console.log('true');
			$rootScope.$broadcast("NewRecord", null);
		}else {
			$location.path('/records');
		}
	}

	$scope.SearchRecord = function () {
		$scope.ShowRecordNavThing = true;
		Globals.SetRecordId(null);
		//$rootScope.$broadcast("SearchRecords");
		$location.path('/records');
		$scope.RecordNo = "";
	}

	$scope.SearchRecordNo = function () {
		Globals.SetRecordId($scope.RecordNo);
		//$location.path('/records');
		$rootScope.$broadcast('ShowRecord');
		$scope.$broadcast('EnableNavButtons');
	}


	$scope.NextRecord = function () {
		var RecordInt = parseInt($scope.RecordNo);
	    $rootScope.$broadcast("NextRecord", RecordInt);
	    $scope.RecordNo = RecordInt + 1;
	}

	$scope.PrevRecord = function () {
		if($scope.RecordNo == 1) {
			$scope.DisablePrev = true;
		}
		var RecordInt = parseInt($scope.RecordNo);
	    $rootScope.$broadcast("PrevRecord", RecordInt);
	    $scope.RecordNo = RecordInt - 1;
	}

	$scope.$on('ClearNavSearch', function (event) {
		$scope.RecordNo = "";
	});
	$scope.$on('SetNavSearch', function (event, id) {
		$scope.ShowRecordNavThing = true;
		$scope.RecordNo = id;
	});

	$scope.$on("$locationChangeStart", function (event) {
	    $scope.ShowRecordNavThing = ($location.path().indexOf("record") == -1) ? false : true;
	});

}]);