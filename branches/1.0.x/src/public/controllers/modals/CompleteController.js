angular.module('MCS_ServiceApp')
.controller('CompleteController', ['$scope', '$rootScope', function ($scope, $rootScope) {

    $scope.ShowPaymentType = false;
    $scope.PaymentType = '';

    $scope.Completed = {
        "ActionNotes": "",
        "RepairedBy": "0",
        "Date": new Date().toLocaleString()
    }


    $("#CompleteModal").modal({
        show: false
    });

    $scope.$on('ShowCompleteMe', function (event, paymentType) {
        $("#CompleteModal").modal('show');

        $scope.PaymentType = paymentType;
        setTimeout(function () {
            $('#ActionInput').focus();
        }, 500);
        
        if(paymentType == "") {
            console.log(paymentType);
            $scope.ShowPaymentType = true;
        }else {
            $scope.ShowPaymentType = false;
        }
    });

    $scope.$on('UnCompleteMe', function (event) {
        $scope.Completed = {
            "ActionNotes": "",
            "RepairedBy": "0",
            "Date": new Date().toLocaleString()
        }
    });

    $scope.Complete = function () {
        $rootScope.$broadcast("CompleteRecord", $scope.Completed, $scope.PaymentType);
        $("#CompleteModal").modal('hide');
        $scope.ShowPaymentType = false;

    }
    
}]);