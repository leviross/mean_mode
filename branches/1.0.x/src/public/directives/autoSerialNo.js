app.directive('autoSerialNo', ['PartService', '$rootScope', '$timeout',  function (PartService, $rootScope, $timeout) {

	return {
		restrict: 'A',
		link: function (scope, elem, attr, ctrl) {
			elem.autocomplete({
				minLength: 3, 
				source: function (searchTerm, response) {
					PartService.SearchSerialNos(searchTerm.term, function (retval) {
						response($.map(retval, function (comp) {
							return {
								label: comp.SerialNo, 
								value: comp
							}

						}));
						
					});
				}, 
				focus: function (event, selectedItem) {
					event.preventDefault();
				},
				select: function (event, selectedItem) {
					event.preventDefault();
					var asset = selectedItem.item.value;
					scope.$apply();

					PartService.GetModelById(asset.ModelId, function (retval) {
						var assetObj = {SerialNo: asset.SerialNo, TagNo: asset.TagNo, Brand: retval.Brand, ModelNo: retval.ModelNo, ModelName: retval.ModelName, Index: scope.$index}
						$timeout(function () {
							$rootScope.$broadcast('SetSerialInfo', assetObj);
						}, 400);

					});

				}
			});
		}
	}


}]);