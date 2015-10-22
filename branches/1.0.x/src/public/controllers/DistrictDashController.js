app.controller('DistrictDashController', ['$scope', '$rootScope', 'DistrictService', 'RecordService', 'Globals', 'ContactService', function ($scope, $rootScope, DistrictService, RecordService, Globals, ContactService) {

	$scope.Section = 1;
	$scope.User = {NameFirst: "Levi", Type: "Kent"};//DistrictService.GetUser();
	$scope.Brands = Globals.Brands();
	$scope.SearchFields = Globals.SearchFields();
	$scope.Recents = [];
	$scope.Schools = [];

	var ResetAll = function () {
		$scope.SearchTerm = "";
		$scope.Section = 1;
	}

	$scope.NewRecord = function () {
		$scope.Section = 3; 
		$scope.Record = null;
		//TODO: Search by the Users District and find Companys (School) Names under that district.
		//This will be a drop down select, so they can choose which location they are doing the order on.
		//Grab the user disctrict and search Contacts collection. 
		//Match the docs' Type against user District, then put the docs' Company in an array. 
		//Response will be that array as a dropdown list of schools. 
		ContactService.GetCompaniesByType($scope.User.Type, function (retval) {
			var finalArr = [];
			retval.forEach(function (school) {
				finalArr.push({name: school});
			})
			$scope.Schools = finalArr;
		});
	}

	$scope.CreateRecord = function () {
		$scope.Record.Type = $scope.User.Type;
		console.log($scope.Record);
		RecordService.CreateDistrictRecord($scope.Record, function (retval) {
			console.log(retval);
		});
	}

	$scope.ViewRecentRec = function (index) {
		$scope.Record = $scope.Recents[index];
		$scope.Section = 2;
	}

	$scope.Print = function () {
		var newTab = window.open('/district-print.html');
		newTab.Record = $scope.Record;
	}


	
	$scope.SearchRecords = function () {

		if($scope.SearchType.name == "JobId") {
			var jobId = parseInt($scope.SearchTerm);
			RecordService.GetRecordById(jobId, function (retval) {
				if(retval != "null" && retval.Type != $scope.User.Type) {
					//Make sure only this district can find its own records and not any other district
					alert("You can only see orders from your district.");
				}else if(retval == "null") {
					alert("That didn't match any records.");
				}else {
					$scope.Record = retval;	
					$scope.Section = 2;
				}
			});
		}else if($scope.SearchType.name == "WorkOrderNo") {
			RecordService.GetRecordByWorkOrder($scope.SearchTerm, function (retval){
				if(retval != "null" && retval.Type != $scope.User.Type) {
					//Make sure only this district can find its own records and not any other district
					alert("You can only see orders from your district.");
				}else if(retval == "null") {
					alert("That didn't match any records.");
				}else {
					$scope.Record = retval;	
					$scope.Section = 2;
				}
			});
		}else {
			if($scope.SearchType.name == "SerialNo") {
				var serialNo = $scope.SearchTerm;
				var assetTag = "";
			}else {
				var assetTag = $scope.SearchTerm;
				var serialNo = "";
			}
			var recordObj = {SerialNo: serialNo, AssetTag: assetTag};
			RecordService.GetRecordByAsset(recordObj, function (retval) {
				if(retval != "null" && retval.Type != $scope.User.Type) {
					//Make sure only this district can find its own records and not any other district
					alert("You can only see orders from your district.");
				}else if(retval == "null") {
					alert("That didn't match any records.");
				}else {
					$scope.Record = retval;	
					$scope.Section = 2;
				}
			});
		}
	}


	$scope.Back = function () {
		$scope.Section = 1;
		ResetAll();
	}


	$scope.Logout = function () {
		var url = 'http://localhost:3030/district-login.html';
		DistrictService.Logout();
		window.location = url;
	}

	var GetRecentRecs = function () {
		DistrictService.GetRecentRecs($scope.User.Type, function (retval) {
			$scope.Recents = retval;
		});
	}

	GetRecentRecs();



}]);