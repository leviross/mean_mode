angular.module('MCS_ServiceApp')
.controller('FindPartController', ['$scope', '$rootScope', 'PartService', function ($scope, $rootScope, PartService) {

    $("#FindPartModal").modal({
        show: false
    });

    //console.log("z-index: " + $("#PartNoInput").zIndex());

    $scope.$on('ShowPartPicker', function (event, part) {
        if (part != null) {
            $scope.Part = part;
            $scope.IsNew = false;            
        } else {
            $scope.NewPart();
            $scope.IsNew = true;
        }
        $("#FindPartModal").modal('show');
    });

    $scope.UpdatePart = function () {
        $rootScope.$broadcast("PartUpdated", $scope.Part);
        $("#FindPartModal").modal('hide');
    }

    $scope.AddPart = function () {
        $rootScope.$broadcast("PartAdded", $scope.Part);
        $("#FindPartModal").modal('hide');
    }

    $scope.$on('SetPartNo', function (event, part) {
        $scope.Part.PartNo = part.PartNo;
        $scope.Part.Desc = part.Desc;
        $scope.Part.Qty = 1;
    })

    $scope.Close = function () {
        $("#FindPartModal").modal('hide');
        $rootScope.$broadcast("PartNotUpdated");            
    }

    $scope.SearchPartNo = function () {
        PartService.SearchPartNos($scope.Part.PartNo, function (retval) {
           $scope.Part.Desc = retval[0].Desc;
           //$scope.Part._id = retval[0]._id; we dont want to save id any more for mike
        });
    }

    $scope.NewPart = function () {
        $scope.Part = {
            "ItemType": "service",
            "Hide": false,
            "OrderNo": null,
            "ServiceType": "0",//Change to ServiceType
            "OrderedBy": "",
            "OrderedOn": new Date().toLocaleString(),
            "Qty": 1,
            "PartNo": "",
            "Desc": "",
            "Cost": null,
            "Price": null,
            "ShippingCost": null,
            "Esc": false,
            "Received": false,
            "ShippingInfo": {
                "SentBy": "",
                "SentOn": "",
                "TrackingNo": ""
            },
            "ReceivingInfo": {
                "ReceivedBy": "",
                "ReceivedOn": ""
            }
        }
    }

}]);
