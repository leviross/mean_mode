app.directive('autoModelNo', ['PartService', '$rootScope', '$timeout', function (PartService, $rootScope, $timeout) {
	
	return {
		restrict: 'A',
		link: function (scope, elem, attr, ctrl) {
			elem.autocomplete({
				minLength: 2,
				source: function (searchTerm, response) {

					PartService.SearchModelNos(searchTerm.term, function (retval) {
						response($.map(retval, function (model) {

							return {
								label: model.ModelNo,
								value: model
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
					$timeout(function () {
						$rootScope.$broadcast('SetRecordModel', scope.$index, selectedItem.item.value);
					}, 400);
					$timeout(function () {
						$rootScope.$broadcast('SetPartsModel', selectedItem.item.value);
					}, 400);
					
				}
			});
		}
	}

}]);

