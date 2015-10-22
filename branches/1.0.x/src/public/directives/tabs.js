app.directive('tabs', function () {

	var index = null;
	var currentPane = {};
	var currentEvent = null;


	return {
		restrict: 'A',
		transclude: true,
		scope: {},
		controller: function ($scope, $element, $rootScope, RecordService) {

			var panes = $scope.panes = [];

			$scope.MakeActive = function (pane) {
				angular.forEach(panes, function (pane) {
					pane.Selected = false;
				});
				pane.Selected = true;
			}

			$scope.$on('MakeLastTabActive', function (event) {
				angular.forEach(panes, function (pane) {
					pane.Selected = false;
				});
				panes[panes.length-1].Selected = true;
			});

			$scope.AddCloseButton = function () {
				angular.forEach(panes, function (pane) {
					pane.CloseButton = true;
				});
				panes[panes.length-1].CloseButton = false;
			}

			this.AddPane = function (pane) {
				if(panes.length === 0) {
					$scope.MakeActive(pane);
				}
				panes.push(pane);
				$scope.AddCloseButton();
			}

			$scope.ResetSelected = function () {
		        angular.forEach(panes, function (pane) {
		            pane.Selected = false;
		        });
		    }

			$scope.Select = function (index, pane) {
				var recordsArray = RecordService.GetRecordsArray();
				if(pane.title === "New Tab") {
					if(panes.length === 6) { return alert("You have reached the max amount of tabs."); }
					$scope.$emit('SaveCurrentRecord');
					$scope.$emit('AddTab', index);
					$scope.$emit('NewRecord', index);
					$scope.MakeActive(pane);
				}else {
					$scope.$emit('SaveCurrentRecord');
					$scope.$emit('ShowSelectedRecord', index);
					$scope.MakeActive(pane);
				}

			}

			$scope.CheckIfCloseTab = function (index, pane, event) {
				if(panes.length === 2) { return alert("Can not close last open tab."); }
				event.preventDefault();
				event.stopPropagation();
				if(pane.Selected) {
					$scope.$emit('SaveCurrentRecord');
				}
				var tabRec = RecordService.GetRecordsArray()[index];
				var tabSettings = RecordService.GetSettingsArray()[index];

				if(!tabSettings.Pristine) {
					var discardChanges = confirm("Are you sure you want to discard your changes?");
			        if(discardChanges) {
			         	$scope.$emit('CloseTab', index);
			         	panes.splice(index, 1);
			         	$scope.ResetSelected();
						panes[0].Selected = true;
						$scope.$emit('ShowSelectedRecord', 0);
			        }
				}else {
					$scope.$emit('CloseTab', index);
					panes.splice(index, 1);
					$scope.ResetSelected();
					panes[0].Selected = true;
					$scope.$emit('ShowSelectedRecord', 0);
				}
		
			}

		}, 
		templateUrl: './views/directives/tabs.html',
		replace: true			
	}


});