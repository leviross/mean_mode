app.controller('NotesController', ['$scope', '$rootScope', function ($scope, $rootScope) {

	$scope.Section = 1;
	$scope.EditMode = false;
	$scope.TechNotes = [];
	var CurrentNoteIndex = 0;

	$('#NotesModal').modal({
		show: false
	});

	$scope.$on('ShowAllNotesModal', function (event, notes) {
        $('#NotesModal').modal('show');
		$scope.TechNotes = notes;

    });

    $scope.AddNote = function () {
    	$scope.Section = 2;
    	setTimeout(function () {
            $('#NoteInput2').focus();
        }, 600);
    }

    $scope.EditNote = function (note, index) {
    	CurrentNoteIndex = $scope.TechNotes.length - 1 - index;
    	$scope.TechNote = note;
    	$scope.Section = 2;
    	$scope.EditMode = true;
    }

    $scope.BackToNotes = function () {
    	$scope.Section = 1;
    	$scope.EditMode = false;
        $scope.TechNote = "";
    }

    $scope.Submit = function () {
    	$rootScope.$broadcast('NoteAdded', $scope.TechNote);
    	$scope.Section = 1;
    	$scope.NoteArea.$setPristine();
    	$scope.TechNote = "";
    }

    $scope.SubmitEdit = function () {
    	$scope.TechNotes[CurrentNoteIndex].Note = $scope.TechNote;
    	$scope.TechNotes[CurrentNoteIndex].Tech = "Levi R.";
    	$scope.TechNotes[CurrentNoteIndex].DateModified = new Date().toLocaleString();
    	$scope.Section = 1;
    	$scope.NoteArea.$setPristine();
    	$scope.TechNote = "";
    	$scope.EditMode = false;
    }




}]);