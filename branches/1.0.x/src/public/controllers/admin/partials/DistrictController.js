app.controller('DistrictController', ['$scope', 'DistrictService', '$rootScope', 'Globals', 'ContactService', function ($scope, DistrictService, $rootScope, Globals, ContactService) {

	$scope.Section = 1;
	$scope.District = null;
	$scope.DistrictObj = "";
	$scope.Districts = [];
	$scope.Contacts = [];
	$scope.Name = ""
	$scope.FullName = "";
	$scope.ShowEditName = false;

	var getAllDistricts = function () {
		DistrictService.GetAllDistricts(function (retval) {
			$scope.Districts = retval;
		});
	}

	$scope.SearchContacts = function () {
		$rootScope.$broadcast("ShowContactPicker", "District");
	}

	$scope.$on('DistrictContactSelected', function (event, contactId) {
		$scope.District.Contacts.push(contactId);//Push in the id of the selected contact
		DistrictService.UpdateDistrict($scope.District, function (retval) {
			console.log(retval);
			GetAllDistrictContacts(); //Get all the contacts by their Ids so UI is updated.
		});
	});

	$scope.RemoveContact = function (index) {
		$scope.District.Contacts.splice(index, 1);
		$scope.Contacts.splice(index, 1);
		DistrictService.UpdateDistrict($scope.District, function (retval) {
			console.log(retval);
		});
	}

	$scope.SelectDistrict = function () {
		$scope.Contacts = [];
		angular.forEach($scope.Districts, function (district) {
			if(district.Name == $scope.DistrictObj.Name) {
				$scope.District = district;
				DistrictService.SetCurrentDistrict(district.Name);
				GetAllDistrictContacts();
			}
		});
		$scope.EmailForm.$setPristine();
	}

	var GetAllDistrictContacts = function () {
		$scope.Contacts = [];
		$scope.District.Contacts.forEach(function (contactId) {
			ContactService.GetContactById(contactId, function (contactObj) {
				$scope.Contacts.push(contactObj);
			});
		});
	}


	$scope.AddDistrict = function () {
		$scope.Section = 2;
		$scope.District = null;
		$scope.Name = "";
		$scope.FullName = "";
	}

	$scope.CreateDistrict = function () {
		var districtObj = {Name: $scope.Name, FullName: $scope.FullName, EmailTemplate: Globals.EmailTemplate()};
		DistrictService.CreateNewDistrict(districtObj, function (retval) {
			console.log(retval);
			$scope.Section = 1;
			$scope.ShowEditName = false;
			getAllDistricts();
			$scope.Contacts = [];
		});
	}

	$scope.EditDistrict = function () {
		$scope.ShowEditName = true;
		setTimeout(function () {
			$('#EditName').focus();
		}, 300);
	}

	var ValidateEmail = function (template) {
		var variables = Globals.EmailVariables();

		var currentArrowIndex = 0;		

		while(template.indexOf('<', currentArrowIndex) > -1) {
			currentArrowIndex = template.indexOf('<', currentArrowIndex);
			var start = 0; 
			var end = 0;
			//Increment leftArrow and make sure we have 2 << in a row...
			currentArrowIndex++;
			if(template.charAt(currentArrowIndex) != "<" ) {
				return false;
			}
			//Make sure we dont have any more than 2...
			if(template.charAt(currentArrowIndex+1) == "<" ) {
				return false;
			}
			//Remember our starting point of our word to check...
			start = currentArrowIndex + 1; 

			currentArrowIndex = template.indexOf('>', currentArrowIndex);
			//Make sure we even have a > arrow at all...
			if(currentArrowIndex == -1) {
				return false;
			}
			currentArrowIndex++;
			//Make sure we have 2 >> in a row...
			if(template.charAt(currentArrowIndex) != ">" ) {
				return false;
			}
			//Check that we dont have more than 2 >>...
			if(template.charAt(currentArrowIndex+1) == ">" ) {
				return false;
			}
			//Remember our ending point of our word to check...
			end = currentArrowIndex-1; 

			var word = template.substring(start, end).toLowerCase();
			//Match the words...
			if(variables.indexOf(word) == -1) {
				return false;
			}

		}
		return true;
	}

	$scope.UpdateEmailTemplate = function () {
		var template = $scope.District.EmailTemplate;
		var isValid = ValidateEmail(template);

		if(isValid) {
			DistrictService.UpdateDistrict($scope.District, function (retval) {
				console.log(retval);
			});
		}else {
			alert("Make sure to use add '<<'  &  '>>' before and after the variables.");
		}
	}

	$scope.UpdateDistrict = function () {
		DistrictService.EditDistrictName($scope.District, function (retval) {
			$scope.District = retval;
			$scope.ShowEditName = false;
		});
	}

	$scope.ToggleSendEmail = function () {
		DistrictService.UpdateDistrict($scope.District, function (retval) {
			console.log(retval);
		});
	}

	$scope.EditDistrictContact = function (index) {
		$scope.Section = 3;
		$scope.DistrictContact = $scope.Contacts[index];
		$scope.CurrentContactIndex = index;
	}

	$scope.BackToDistrict = function () {
		$scope.Section = 1;
		$scope.ShowEditName ? $scope.ShowEditName = false : "Already false";
	}

	$scope.UpdateDistrictContact = function () {
		ContactService.UpdateContactRecord($scope.DistrictContact, function (retval) {
			$scope.Section = 1;
			GetAllDistrictContacts();
		});
	}

	$scope.DeleteDistrict = function () {
		var confirmDelete = confirm("Are you sure you want to delete a whole district?");
		if(confirmDelete) {
			DistrictService.DeleteDistrict($scope.District._id, function (retval) {
				console.log(retval);
				$scope.District = null;
				getAllDistricts();
			});
		}
	}

	$scope.$on('InitDistrictPage', function (event) {
		$scope.Section = 1;
		$scope.ShowEditName = false;
		$scope.District = null;
		getAllDistricts();
	});

	getAllDistricts();

}]);