app.controller('AddPartController', ['$scope', '$rootScope', 'PartService', 'Globals', function ($scope, $rootScope, PartService, Globals) {

	$scope.EditMode = false;
	$scope.Index = 0;
    $scope.Brands = Globals.Brands();
    $scope.Brand = "";
    var partNo = "";
    var partId = "";



	$("#AddPartModal").modal({
		show: false
	});

    $scope.$on('AddPartModal', function (event) {
        $('#AddPartModal').modal('show');

        $scope.PartNo = ""; 
        $scope.Desc = "";
        $scope.Cost = "";
        $scope.Price = "";
        $scope.Brand = "";
        $scope.ModelName = "";
        $scope.ModelNo = "";
        
        setTimeout(function () {
            $('#PartInput').focus();
        }, 700);
    });

    $scope.$on('EditPartModal', function (event, partNo, desc, cost, price, id, index) {
        $('#AddPartModal').modal('show');
        $scope.No = partNo; 
        $scope.Desc = desc;
        $scope.Cost = cost;
        $scope.Price = price;
        partNo = partNo;
        partId = id;

        setTimeout(function () {
            $('#PartInput').focus();
        }, 700);
        $scope.EditMode = true;
        $scope.Index = index;
    });


    $scope.AddPart = function () {
    	var partObj = {No: $scope.No, Desc: $scope.Desc, Price: $scope.Price, Cost: $scope.Cost,
        Brand: $scope.Brand.name, ModelNo: $scope.ModelNo, ModelName: $scope.ModelName};

    	PartService.CreatePart(partObj, function (retval) {
    		console.log("Successfully created that part ----", retval);
    		$rootScope.$broadcast('ShowCreatedPart', retval);
    	});
    	$('#AddPartModal').modal('hide');
    	$scope.PartForm.$setPristine();
    	$scope.No = "";
    	$scope.Desc = "";
        $scope.Cost = "";
        $scope.Price = "";
    }



}]);


