app.directive('ngPartDesc', ['$rootScope', function ($rootScope) {

	return {
		restrict: 'A',
		link: function (scope, element, attrs) {
			element.bind("keydown keypress", function (event) {
				if(event.which === 13) {
					event.preventDefault();
					$rootScope.$broadcast('SearchPartDesc');
				}
			});
		}
	}


}]);