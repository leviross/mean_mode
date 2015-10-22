app.directive('pane', function () {

	return {
		require: '^tabs',
		restrict: 'A',
		transclude: true,
		scope: { 
			title: '@',
			
		},
		link: function (scope, element, attrs, tabsCtrl) {
			tabsCtrl.AddPane(scope);
		},
		template: '<div class="tab-pane" ng-class="{active: scope.Selected}" ng-transclude>' +
			'</div>',
		replace: true	
	}


});

