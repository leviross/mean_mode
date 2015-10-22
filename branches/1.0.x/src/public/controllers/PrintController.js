app.controller('PrintController', ['$scope', '$rootScope', '$timeout', '$window', function ($scope, $rootScope, $timeout, $window) {

	//listen for print broadcast ...passing 3 params. 
	//1 - what template to print. 
	//2 - the object that has the corrent data to fill the template with
	//3 - if we want to show that to the user before exec print

	//Question for Mike: If we are trying to show the print preview page in a modal, wouldnt that by definition
	//not be the iframe route? 


	$('#PrintRecordModal').modal({
		show: false
	});

	$scope.data = { 
		View: "",
		ShowPrintPrev: false,
		Record: null
	}

	$scope.$on('PrintPage', function (event, view, data, printPrev) {
		
		switch (view) {
			case "Record":
   				var newTab = window.open('/print.html');
   				newTab.Record = data.Record;
   				newTab.Totals = data.Totals;

				break;
		} 
	});

	

}]);