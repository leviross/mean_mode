angular.module('MCS_ServiceApp')
.controller('DashboardController', ['$scope', '$rootScope', 'UserService', '$routeParams',  'RecordService', '$location', 'Globals', function ($scope, $rootScope, UserService, $routeParams, RecordService, $location, Globals) {

	$scope.User = null;
    var UserId = $routeParams.id;
    //console.log(UserId);

    $scope.Recents = [];

    var recArr = RecordService.GetRecordsArray();
    angular.forEach(recArr, function (rec) {
        if(rec._id) { 
            $scope.Recents.push(rec);
        }
    })
    UserService.LoadUser(UserId, function (data) {
        $scope.User = data;
    });

    $scope.GoToRecord = function (id) {
        Globals.SetRecordId(id);
        //$rootScope.$broadcast('ShowRecord');
        RecordService.ClearRecordsArray();
        $rootScope.$broadcast('SetNavSearch', id);
        $location.path('/records');
    }

    $scope.PartArrived = function (recordId) {
        alert("Part marked as received by Mike Rew @ " + new Date().toLocaleString());
    }

    $scope.YouCompleteMe = function (recordId) {
        $rootScope.$broadcast("ShowCompleteMe");
    }

    
}]);