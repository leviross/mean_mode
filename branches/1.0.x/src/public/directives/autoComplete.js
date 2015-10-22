app.directive('autoComplete', ['ContactService', 'Globals', '$location', '$rootScope', '$timeout', function (ContactService, Globals, $location, $rootScope, $timeout) {
	return {
		restrict: 'A',
		link: function (scope, elem, attr, ctrl) {
			elem.autocomplete({
				minLength: 3,
				source: function (searchTerm, response) {
						ContactService.GetContactByAnyField(searchTerm.term, function (retval) {
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
					Globals.SetRecordId(0);
					//$rootScope.$broadcast("NewRecord");
					$location.path('/records');
					scope.$apply();
					$timeout(function () {
						$rootScope.$broadcast("ContactSelected", selectedItem.item.value);
					}, 700);

				}
			});
		}
	}

}]);

