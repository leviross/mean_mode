angular.module('MCS_ServiceApp')
.controller('AdminController', ['$scope', '$rootScope', 'UserService', 'Globals', '$routeParams', '$location', 'PartService', function ($scope, $rootScope, UserService, Globals, $routeParams, $location, PartService) {
	
	var Tabs = [ 'views/admin/partials/users.html', 'views/admin/partials/brands.html', 'views/admin/partials/warrantyTypes.html', 'views/admin/partials/repairTypes.html', 'views/admin/partials/taxRate.html', 'views/admin/partials/districts.html'  ];
	$scope.DisplayMode = 'list';
	$scope.UserTypes = [{id: "1", name: "Admin", value: true}, {id: "2", name: "Non-Admin", value: false}];
	$scope.WarrantyTypes = [{id: "1", name: "Manufacturer Warranty"}, {id: "2", name: "MicroK12 90 Day Warranty"}, {id: "3", name: "None"}];
	$scope.RepairTypes = Globals.RepairTypes();
	

	$scope.data = {
		index: null,
		Section: 1,
		Brand: "",
		ModelNo: "",
		ModelName: "",
		ModelNos: [],
		ModelId: "",
		PartId: "",
		PartNo: "",
		PartDesc: "",
		PartCost: "",
		PartPrice: "",
		HaveModelNo: false,
		HavePartNo: false,
		PartIdSearch: false,
		//ModelNames: null,
		Brands: Globals.Brands(),
		PartsList: []//PartService.GetPartsArray()	
	};

	Mousetrap.bind(['ctrl+s', 'command+s'], function (e) {
        if(e.preventDefault) {
            e.preventDefault();
        }else {
            e.returnValue = false;
        }
        $scope.Update();
    });
	

	Globals.GetTaxRate(function (currentTaxRate) {
		$scope.TaxRate = currentTaxRate;
	});

	$scope.TaxRate = Globals.GetTaxRateVar();
	
	if($routeParams.type == "users") {
		$scope.Tab = 0;
		$scope.TabView = Tabs[0];
		UserService.GetAllUsers(function (usersArray) {
			$scope.Users = usersArray;
		});
	}else if($routeParams.type == "brands") {
		$scope.Tab = 1;
		$scope.TabView = Tabs[1];
	}else if($routeParams.type == "warranty-types") {
		$scope.Tab = 2;
		$scope.TabView = Tabs[2];
	}else if($routeParams.type == "repair-types") {
		$scope.Tab = 3;
		$scope.TabView = Tabs[3];
	}else if($routeParams.type == "tax-rate") {
		$scope.Tab = 4;
		$scope.TabView = Tabs[4];
		Globals.GetTaxRate(function (rate) {
			$scope.TaxRate = rate;
		});
	}else if($routeParams.type == "districts") {
		$scope.Tab = 5;
		$scope.TabView = Tabs[5];
	}

	$scope.SelectTab = function (setTab) {
		if(setTab == 0) {
			$location.path('/admin/users');
		}else if(setTab == 1) {
			$location.path('/admin/warranty-types');
		}else if(setTab == 2) {
			$location.path('/admin/repair-types');
		}else if(setTab == 3) {
			$location.path('/admin/tax-rate');
		}else if(setTab == 4) {
			$location.path('/admin/districts');
			$scope.$broadcast('InitDistrictPage');
		}
	}

	$scope.IsSelected = function (checkTab) {
		return $scope.Tab === checkTab;
	}

	$scope.EditUser	= function (user) {
		$scope.DisplayMode = 'edit';
		$scope.UserDetails = user;
	}

	$scope.UpdateUserPassword = function () {
		if($scope.UserDetails.NewPassword1 !== $scope.UserDetails.NewPassword2) {
			alert("Passwords do not match, please try again.");
		}else {
			var ObjToPass = { Email: $scope.UserDetails.Email, NewPassword: $scope.UserDetails.NewPassword1 };
			UserService.UpdateDbPassword(ObjToPass, function (retval) {
				$scope.UserDetails.NewPassword1 = "";
				$scope.UserDetails.NewPassword2 = "";
			});
		}
		this.NewPassword1 = "";
		this.NewPassword2 = "";	
		this.UserForm.$setPristine();
	}

	$scope.BackToUsers = function () {
		this.UserForm.$setPristine();
		$scope.DisplayMode = 'list';
	}


	$scope.NewUser = function () {
		$scope.DisplayMode = 'edit';
		$scope.UserDetails = {
			Name: "",
			Email: "",
			Password1: "",
			Password2: "",
			IsAdmin: "2",
			IsActive: true,
			_id: null
		}
	}

	$scope.CreateUser = function () {
		if($scope.UserDetails.Password1 != $scope.UserDetails.Password2) {
			alert("Passwords don't match, please try again.");
		}else {
			var NewUserObj = {Name: $scope.UserDetails.Name, Email: $scope.UserDetails.Email, Password: $scope.UserDetails.Password1, 
				IsAdmin: $scope.UserDetails.IsAdmin}
			UserService.CreateNewUser(NewUserObj);
			$scope.DisplayMode = 'list';
		}
		this.UserForm.$setPristine();		
	}

	$scope.DeActivate = function (user) {
		UserService.DeActivateUser(user.Email, function () {
			user.IsActive = false;	
		});
	}

	$scope.Activate = function (user) {
		UserService.ActivateUser(user.Email, function () {
			user.IsActive = true;	
		});
	}

	$scope.UpdateTax = function (taxRate) {
		var TaxRateObj = {TaxRate: taxRate};
		Globals.SetTaxRate(TaxRateObj, function (newRate) {
			$scope.TaxRate = newRate.Value;
			alert("Tax Rate updated successfully!");
		});
		this.TaxForm.$setPristine();
	}



}]);