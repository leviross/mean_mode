angular.module('MCS_ServiceApp')
.filter('PageFilter', function () {
    return function (input, start) {
        start = +start; // parse to int
        return input.slice(start);
    }

});