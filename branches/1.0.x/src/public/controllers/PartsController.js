app.controller('PartsController', ['$scope', '$rootScope', 'Globals', 'PartService', function ($scope, $rootScope, Globals, PartService) {
		
	$scope.Section = 1;
	$scope.Brands = Globals.Brands();
	$scope.SearchTerm = 0;

	

	Mousetrap.bind(['ctrl+s', 'command+s'], function (e) {
        if(e.preventDefault) {
            e.preventDefault();
        }else {
            e.returnValue = false;
        }
        $scope.Update();
    });

    $scope.BackToParts = function () {
    	$scope.Section = 1;
    	ResetAll();
    }

    function ResetAll () {
    	$scope.ModelNo = "";
		$scope.Brand = "";
		$scope.ModelName = "";
		$scope.PartDesc = "";
		$scope.PartNo = "";
		$scope.PartCost = "";
		$scope.PartPrice = "";
		$scope.HaveModelNo = false;
		$scope.HavePartNo = false;
		PartIdSearch: false;
		$scope.PartsForm.$setPristine();
    }

	$scope.AddModel = function () {
		$scope.Section = 2;
		$scope.Brand = "";
	}

	$scope.SelectBrand = function () {
		$scope.Section = 3;
		$scope.ModelNo = "";
		$scope.ModelName = "";
		PartService.ClearPartsArray();
	}

	$scope.CreateModel = function () {
		PartService.CreateModel($scope.Brand.name, $scope.ModelName, $scope.ModelNo, function (retval) {
			console.log(retval);
			alert("Model created successfully!");
			$scope.ModelId = retval._id;
			$scope.Section = 1;
			$scope.ModelNo = retval.ModelNo;
			$scope.Brand = retval.Brand;
			$scope.PartNo = "";
			$scope.PartDesc = "";
			$scope.PartCost = "";
			$scope.PartPrice = "";
			$scope.HaveModelNo = true;
			$scope.HavePartNo = false;

		});
		PartService.ClearPartsArray();
		$scope.PartsList = PartService.GetPartsArray();
	}

	$scope.Update = function () {
		if($scope.HaveModelNo) {
			var modelObj = {ModelName: $scope.ModelName, ModelNo: $scope.ModelNo};
			PartService.EditModel($scope.ModelId, modelObj, function (retval) {
				$scope.ModelNo = retval.ModelNo;
				$scope.Brand = retval.Brand;
				$scope.ModelName = retval.ModelName;
				$scope.HaveModelNo = true;
				$scope.HavePartNo = false;
			});
		}else if($scope.HavePartNo) {
			var modelObj = {ModelName: $scope.ModelName, ModelNo: $scope.ModelNo, 
				No: $scope.PartNo, Desc: $scope.PartDesc, Cost: $scope.PartCost, 
				Price: $scope.PartPrice};
			PartService.EditPart($scope.PartId, modelObj, function (retval) {
				$scope.PartNo = retval.No;
				$scope.PartDesc = retval.Desc
				$scope.PartCost = retval.Cost;
				$scope.Price = retval.Price;
				$scope.ModelNo = retval.Models[0].ModelNo;
				$scope.ModelName = retval.Models[0].ModelName;
				$scope.HaveModelNo = false;
				$scope.HavePartNo = true;
			});
		}
	}

	$scope.DeleteModel = function () {
		if(confirm("Are you sure you want to delete this Model?")) {
			PartService.DeleteModel($scope.ModelId, function () {
				PartService.ClearPartsArray();
				ResetAll();
			});
		}
		
	}

	$scope.DeletePart = function () {
		if(confirm("Are you sure you want to delete this Part?")) {
			PartService.DeletePart($scope.PartId, function (retval) {
				console.log(retval);
				ResetAll();
				$scope.PartsList.splice($scope.index, 1);			
			});
		}
	}

	$scope.DeleteArrayPart = function (id, index) {
		if(confirm("Are you sure you want to delete this Part?")) {
			PartService.DeletePart(id, function (retval) {
				console.log(retval);
				$scope.PartsList.splice(index, 1);
			});
		}
	}

	$scope.$on('SearchPartNo', function (event) {
		$scope.SearchTerm = $scope.PartNo;
		PartService.SearchPartNos($scope.PartNo, function (retval) {
			$scope.PartsList = retval;
			ResetAll();
			$scope.PartNo = $scope.SearchTerm;
		});
	});

	$scope.$on('SearchPartDesc', function () {
		$scope.SearchTerm = $scope.PartDesc;
		PartService.SearchPartDesc($scope.PartDesc, function (retval) {
			$scope.PartsList = retval;
			ResetAll();
			$scope.PartDesc = $scope.SearchTerm;
		});
	});

	$scope.ShowPartIdInput = function () {
		$scope.PartIdSearch = true;
	}

	$scope.SearchPartById = function () {
		PartService.GetPartById($scope.PartId, function (retval) {
			$scope.PartDesc = retval.Desc;
			$scope.PartNo = retval.No;
			$scope.ModelNo = retval.Models[0].ModelNo; 
			$scope.ModelName = retval.Models[0].ModelName; 
			$scope.Brand = retval.Models[0].Brand; 
			$scope.PartCost = retval.Cost;
			$scope.PartPrice = retval.Price;
			$scope.HaveModelNo = false;
			$scope.HavePartNo = true;
			$scope.PartIdSearch = false;
			$scope.PartId = "";
			PartService.ClearPartsArray();
		});
	}

	$scope.AddPart = function () {
		$rootScope.$broadcast('AddPartModal');
		PartService.SetModelNo($scope.ModelNo);
	}

	$scope.SelectPart = function (index) {
		$scope.index = index;
		if($scope.PartsList[index].Models.length > 0) {
			$scope.Brand = $scope.PartsList[index].Models[0].Brand;
			$scope.ModelNo = $scope.PartsList[index].Models[0].ModelNo;
			$scope.ModelName = $scope.PartsList[index].Models[0].ModelName;
			$scope.PartId = $scope.PartsList[index]._id;
			$scope.PartNo = $scope.PartsList[index].No;
			$scope.PartDesc = $scope.PartsList[index].Desc;
			$scope.PartCost = $scope.PartsList[index].Cost;
			$scope.PartPrice = $scope.PartsList[index].Price;
			$scope.HavePartNo = true;
			$scope.HaveModelNo = false;
		}else {
			$scope.Brand = "";
			$scope.ModelNo = "";
			$scope.ModelName = "";
			$scope.PartId = $scope.PartsList[index]._id;
			$scope.PartNo = $scope.PartsList[index].No;
			$scope.PartDesc = $scope.PartsList[index].Desc;
			$scope.PartCost = $scope.PartsList[index].Cost;
			$scope.PartPrice = $scope.PartsList[index].Price;
			$scope.HavePartNo = true;
			$scope.HaveModelNo = false;
		}
	}
	$scope.$on('ShowCreatedPart', function (event, part) {
		$scope.PartId = part._id;
		$scope.ModelNo = part.Models[0].ModelNo;
		$scope.ModelName = part.Models[0].ModelName;
		$scope.Brand = part.Models[0].Brand;
		$scope.PartDesc = part.Desc;
		$scope.PartNo = part.No;
		$scope.PartCost = part.Cost;
		$scope.PartPrice = part.Price;
		$scope.HavePartNo = true;
		$scope.HaveModelNo = false;
		$scope.PartsList = [];
	});
	
	
	$scope.$on('SetPartsModel', function (event, modelObj) {
		$scope.ModelId = modelObj._id;
		$scope.ModelNo = modelObj.ModelNo;
		$scope.ModelName = modelObj.ModelName;
		$scope.PartDesc = "";
		$scope.PartNo = "";
		$scope.Brand = modelObj.Brand;
		$scope.HaveModelNo = true;
		$scope.HavePartNo = false;
		$scope.PartsList = [];
	});

	$scope.$on('SetPartInfo', function (event, part, searchTerm) {
		$scope.PartId = part._id;
		$scope.PartDesc = part.Desc;
		$scope.PartNo = part.No;
		$scope.ModelNo = part.Models[0].ModelNo; 
		$scope.PartPrice = part.Price;
		$scope.PartCost = part.Cost;
		$scope.Brand = part.Models[0].Brand;
		$scope.ModelName = part.Models[0].ModelName;
		$scope.PartsList = [];
		console.log(part);
		$scope.HaveModelNo = true;
		$scope.HavePartNo = true;
	});
	




}]);