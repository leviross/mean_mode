app.directive('myDatePicker', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
         link: function (scope, element, attrs, ngModelCtrl) {
         	//jQuery date picker widget
            element.datepicker({

                dateFormat: 'mm/dd/yy',
                onSelect: function (date) {
                    scope.date = date;
                    //invoke the setViewValue method of ngModel Ctrl to bind the value to our ngModel on this element
                    ngModelCtrl.$setViewValue(date);
                    scope.$apply();
                }
            });
        }
    }
});