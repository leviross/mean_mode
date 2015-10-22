app.directive('autoComplete', ['ContactService', 'Globals', '$location', '$rootScope', '$timeout', function (ContactService, Globals, $location, $rootScope, $timeout) {
	return {
		restrict: 'A',
		link: function (scope, elem, attr, ctrl) {
			elem.autocomplete({
				minLength: 3,
				source: function (searchTerm, response) {
						//call the contact service GetContactByAnyField method
						ContactService.GetContactByAnyField(searchTerm.term, function (retval) {
							//massage the response array by looping through it and creating custom labels 
							response($.map(retval, function (contact) {
								//console.log("Individual Obj:",contact);

								if(contact.NameFirst.length > 0 && contact.NameLast.length > 0 && contact.Company.length > 0) {
									return {
										label: contact.NameLast + ", " + contact.NameFirst + " - " + contact.Company,
										value: contact
									}
								}else if(contact.NameFirst.length > 0 && contact.NameLast.length > 0 && contact.Company.length == 0) {
									return {
										label: contact.NameLast + ", " + contact.NameFirst,
										value: contact
									}
								}else if(contact.NameFirst.length > 0 && contact.NameLast.length == 0 && contact.Company.length > 0) {
									return {
										label: contact.NameFirst + " - " + contact.Company,
										value: contact
									}
								}else if(contact.NameFirst.length == 0 && contact.NameLast.length > 0 && contact.Company.length > 0) {
									return {
										label: contact.NameLast + " - " + contact.Company,
										value: contact
									}
								}else if(contact.NameFirst.length == 0 && contact.NameLast.length == 0 && contact.Company.length > 0){
									return {
										label: "Company: " + contact.Company,
										value: contact
									}
								}
								
							}))
							
						});
				},
				focus: function (event, selectedItem) {
					event.preventDefault();
				},
				select: function (event, selectedItem) {
					//create new record
					Globals.SetRecordId(0);
					//$rootScope.$broadcast("NewRecord");
					$location.path('/records');
					//since we are in an external library, we call apply()
					scope.$apply();
					//let the new record initialize, then add this contact object to it
					$timeout(function () {
						$rootScope.$broadcast("ContactSelected", selectedItem.item.value);
					}, 700);

				}
			});
		}
	}

}]);

