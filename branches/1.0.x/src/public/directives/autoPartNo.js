app.directive('autoPartNo', ['PartService', '$rootScope', '$timeout', function (PartService, $rootScope, $timeout) {
	var searchterm = "";
	return {
		restrict: 'A',
		link: function (scope, elem, attr, ctrl) {
			elem.autocomplete({
				minLength: 2,
				source: function (searchTerm, response) {
					searchterm = searchTerm.term;
					PartService.SearchPartNos(searchTerm.term, function (retval) {
						response($.map(retval, function (partObj) {
						
							return {
								label: partObj.No,
								value: partObj
							}

						}));
					});	
				},
				focus: function (event, selectedItem) {
					event.preventDefault();
				},
				select: function (event, selectedItem) {
					event.preventDefault();
					scope.$apply();					

					if(attr.id === "Admin") {
						$timeout(function () {
							$rootScope.$broadcast('SetPartInfo', selectedItem.item.value, searchterm);
						}, 400);
					}else {
						$timeout(function () {
							$rootScope.$broadcast('SetPartNo', selectedItem.item.value);
						}, 400);
					}
					
				}
			});
		}
	}

}]);

