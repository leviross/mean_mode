app.directive('tabs', function () {

	var index = null;
	var currentPane = {};
	var currentEvent = null;


	return {
		restrict: 'A',
		transclude: true,
		scope: {},
		controller: function ($scope, $element, $rootScope, RecordService) {
			//init our array of panes
			var panes = $scope.panes = [];
			//make the current pane selected and all else unselected
			$scope.MakeActive = function (pane) {
				angular.forEach(panes, function (pane) {
					pane.Selected = false;
				});
				pane.Selected = true;
			}
			//when a tab is closed, make the last tab selected
			$scope.$on('MakeLastTabActive', function (event) {
				angular.forEach(panes, function (pane) {
					pane.Selected = false;
				});
				panes[panes.length-1].Selected = true;
			});
			//take off the close 'X' button from the last tab which is the 'New Tab' 
			$scope.AddCloseButton = function () {
				angular.forEach(panes, function (pane) {
					pane.CloseButton = true;
				});
				panes[panes.length-1].CloseButton = false;
			}
			//add a new pane to our array
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
		    //select a tab
			$scope.Select = function (index, pane) {
				//var recordsArray = RecordService.GetRecordsArray();
				if(pane.title === "New Tab") {
					if(panes.length === 6) { return alert("You have reached the max amount of tabs."); }
					//emit event to record ctrl to save a virtual copy of the current tab
					$scope.$emit('SaveCurrentRecord');
					//add a new tab
					$scope.$emit('AddTab', index);
					//init new record
					$scope.$emit('NewRecord', index);
					$scope.MakeActive(pane);
				}else {
					//save the current tab
					$scope.$emit('SaveCurrentRecord');
					//get the virtual copy of the new selected tab
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