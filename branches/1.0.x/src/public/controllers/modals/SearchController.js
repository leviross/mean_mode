angular.module('MCS_ServiceApp')
.controller('SearchController', ['$scope', '$rootScope', function ($scope, $rootScope) {


    $("#SearchModal").modal({
        show: false
    });

    $scope.$on('ShowSearchModal', function (event, fieldName) {
        $("#SearchModal").modal('show');

        $scope.SearchFor = fieldName;
        $scope.$apply();

        setTimeout(function () {
            $("#SearchInput").focus();
        }, 1000);

    });

    $scope.Search = function () {

        var fakedata = [
                { recordno: '1001', customer: 'George R.R. Martin', description: 'Bad HDD' },
                { recordno: '99', customer: 'Tom Gravy', description: 'Fell in the toilet again' },
                { recordno: '6987', customer: 'Rosco P. Coltrane', description: 'Started on fire' }
        ];

        $("#searchResults").simple_datagrid({ data: fakedata });

    }

    $scope.SelectCustomer = function () {
        var row = $('#searchResults').simple_datagrid('getSelectedRow');
        $rootScope.$broadcast("CustomerFound", row);
        $("#SearchModal").modal('hide');
    }

}]);