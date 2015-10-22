app.controller('AddNoteController', ['$scope', '$rootScope', function ($scope, $rootScope) {

    $scope.EditMode = false;

     $("#NewNoteModal").modal({
        show: false
    });

    $scope.$on('ShowNoteModal', function (event) {
        $('#NewNoteModal').modal('show');
        $scope.EditMode = false;
        
        setTimeout(function () {
            $('#NoteInput').focus();
        }, 600);

    });

    $scope.Submit = function () {
        $rootScope.$broadcast('NoteAdded', $scope.TechNote);
        $('#NewNoteModal').modal('hide');
        $scope.NoteForm.$setPristine();
        $scope.TechNote = "";
    }

    $scope.SubmitEdit = function () {
        $rootScope.$broadcast('NoteEdited', $scope.TechNote);
        $('#NewNoteModal').modal('hide');
        $scope.NoteForm.$setPristine();
        $scope.TechNote = "";
    }


    $scope.$on('EditNote', function (event, note) {
        $('#NewNoteModal').modal('show');
        $scope.EditMode = true;
        $scope.TechNote = note;
    });


}]);