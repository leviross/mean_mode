angular.module('MCS_ServiceApp')
.controller('InputValueController', ['$scope', '$rootScope', function ($scope, $rootScope) {

    $scope.Modal = {
        Title: "",
        Message: "",
        Callback: "",
        Input: ""
    };

    $scope.$on('ShowInputValue', function (event, title, msg, currentTrackingNo, callback) {
        $scope.Modal.Title = title;
        $scope.Modal.Message = msg;
        $scope.Modal.Callback = callback;
        $scope.Modal.Input = currentTrackingNo;
        $("#InputValueModal").modal('show');
    });

    $scope.Submit = function () {
        $scope.Modal.Callback($scope.Modal.Input);
        $("#InputValueModal").modal('hide');
        $rootScope.$broadcast('PartUpdated');
        $scope.TrackingForm.$setPristine();
    }

}]);
