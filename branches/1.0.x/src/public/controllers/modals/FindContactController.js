angular.module('MCS_ServiceApp')
.controller('FindContactController', ['$scope', '$rootScope', '$http', 'ContactService', 'Globals', 'DistrictService', function ($scope, $rootScope, $http, ContactService, Globals, DistrictService) {

    $scope.RecordId = 0;
    $scope.DisplayMode = "list";
    $scope.Contacts = [];
    $scope.CurrentPage = 0;
    $scope.PageSize = 6;
    $scope.SelectedRowId = null;
    var ControllerContactObj = null;
    $scope.RowSelected  = false;
    $scope.pageLocation = "";

    $scope.NumberOfPages = function () {
        return Math.ceil($scope.Contacts.length/$scope.PageSize);
    };

    $("#findContactModal").modal({
        show: false
    });


    $scope.$on('ShowContactPicker', function (event, location) {
        $("#findContactModal").modal('show');
        $scope.pageLocation = location;

        setTimeout(function () {
            $('#firstName').focus();
        }, 500);
    });

    $scope.SearchBy = function () {
        if($scope.FirstName && $scope.LastName && !$scope.Company) {
            var FullName = $scope.FirstName + " " + $scope.LastName;
            ContactService.GetContactByFullName(FullName, function (retval) {
                $scope.Contacts = retval;
                $scope.RowSelected = false;
                return; 
            });
        }
        if($scope.FirstName && !$scope.LastName && !$scope.Company) {
            ContactService.GetContactByFirst(this.FirstName, function (retval) {
                $scope.Contacts = retval;
                $scope.RowSelected  = false;
                return; 
            });
        }
        if($scope.LastName && !$scope.FirstName && !$scope.Company) {
            ContactService.GetContactByLast(this.LastName, function (retval) {
                $scope.Contacts = retval;
                $scope.RowSelected  = false;
                return; 
            });
        }
        if($scope.Company && !$scope.FirstName && !$scope.LastName) {
            ContactService.GetContactByCompany(this.Company, function (retval) {
                $scope.Contacts = retval;
                $scope.RowSelected  = false;
                return;
            });
        }
        if($scope.FirstName && $scope.LastName && $scope.Company) {
            var AllFields = $scope.FirstName + " " + $scope.LastName + " " + $scope.Company;
            ContactService.GetContactByAllFields(AllFields, function (retval) {
                $scope.Contacts = retval;
                $scope.RowSelected = false;
                return;
            });
        }
    }

    $scope.EditContact = function (contact) {
        $scope.DisplayMode = "edit";
        $scope.ContactDetails = contact;
        $scope.TypeDisplay = contact.TypeDisplay;
    }

    $scope.NewContact = function (event) {
        event.preventDefault();
        $scope.DisplayMode = "new";

        $scope.ContactDetails = {
            Address: '',
            Address2: '',
            City: '',
            State: '',
            Zip: '',
            NameFirst: '',
            NameLast: '',
            Company: '',
            Email: '',
            Phone1: '',
            Phone2: '',
            TypeDisplay: 'Walk In'
        }

    }

    $scope.CreateNewContact = function () {

        var NewContactDetails = {
            Address: $scope.ContactDetails.Address,
            Address2: $scope.ContactDetails.Address2,
            City: $scope.ContactDetails.City,
            State: $scope.ContactDetails.State,
            Zip: $scope.ContactDetails.Zip,
            NameFirst: $scope.ContactDetails.NameFirst,
            NameLast: $scope.ContactDetails.NameLast,
            Company: $scope.ContactDetails.Company,
            Email: $scope.ContactDetails.Email,
            Phone1: $scope.ContactDetails.Phone1,
            Phone2: $scope.ContactDetails.Phone2,
            TypeDisplay: $scope.ContactDetails.TypeDisplay
        }        

        ContactService.CreateNewContact(NewContactDetails);
        $scope.ContactForm.$setPristine();
        $("#findContactModal").modal('hide');
    }

    $scope.UpdateContact = function () {
        //console.log("New Value is: " + newval, "Old Value was: " + oldval);
        var UpdatedContactDetails = {
            Address: $scope.ContactDetails.Address,
            Address2: $scope.ContactDetails.Address2,
            City: $scope.ContactDetails.City,
            State: $scope.ContactDetails.State,
            Zip: $scope.ContactDetails.Zip,
            NameFirst: $scope.ContactDetails.NameFirst,
            NameLast: $scope.ContactDetails.NameLast,
            Company: $scope.ContactDetails.Company,
            Email: $scope.ContactDetails.Email,
            Phone1: $scope.ContactDetails.Phone1,
            Phone2: $scope.ContactDetails.Phone2,
            TypeDisplay: $scope.ContactDetails.TypeDisplay,
            _id: $scope.ContactDetails._id
        }
        ContactService.UpdateContactRecord(UpdatedContactDetails, function (updatedContact) {
            $scope.Contact = updatedContact;
            $scope.ContactForm.$setPristine();
            $("#findContactModal").modal('hide');
        });
        
    }    

    $scope.BackToSearch = function () {
        $scope.DisplayMode = "list";
        $scope.ContactForm.$setPristine();
    }

    $scope.$on("ClearContactSearch", function (event) {
        //Work on clearing all fields after a record create. It still keeps search in field, but list is empty at least.
        $scope.DisplayMode = "list";
        $scope.ContactForm.$setPristine();
        $scope.Contacts = [];
    });

     $scope.SetSelectedRow = function (SelectedContact) {
        $scope.SelectedRowId = SelectedContact._id;
        ControllerContactObj = SelectedContact;
        $scope.RowSelected = true;
    }


    $scope.SelectContact = function () {
        //Check to see if you are coming from District page, then update the Contact.Type every time if it doesnt match our current District.Name
        if($scope.pageLocation == "District") {
            //Get the current Distrcts Name and see if it matches our Contact.Type
            if(ControllerContactObj.Type != DistrictService.GetCurrentDistrict()) {
                ControllerContactObj.Type = DistrictService.GetCurrentDistrict();//If they dont match, then set our Contact.Type to the current District
                ContactService.UpdateContactRecord(ControllerContactObj, function (retval) {//Update the Contact with the new Type
                    $rootScope.$broadcast("DistrictContactSelected", retval._id);
                });  
            }else {//If they match, just keep going with normal flow, send the contact id over to District
                $rootScope.$broadcast("DistrictContactSelected", ControllerContactObj._id);
            }
            
        }else if($scope.pageLocation === "Record") {
            //Check to see if the Contact.Type is any of our hard coded District Names...
            if(Globals.DistrictNames().indexOf(ControllerContactObj.Type) > -1) {
                //if it is, we simply send them back to their normal flow cuz we have the District on Contact already
                $rootScope.$broadcast("ContactSelected", ControllerContactObj); 
            }else {
                //If its not, we then find out if the Company matches a fullname of any District and update it if so...
                DistrictService.GetAllDistricts(function (retval) {
                 
                    angular.forEach(retval, function (district) {
                        if(district.FullName == ControllerContactObj.Company) {
                            ControllerContactObj.Type = district.Name;
                            ContactService.UpdateContactRecord(ControllerContactObj, function (retval) {
                                $rootScope.$broadcast("ContactSelected", retval); 
                            });
                        }else {
                            $rootScope.$broadcast("ContactSelected", ControllerContactObj);
                            //Its possible that this Contact is a school and it has no match for any 
                            //of the districts, discuss this case later and figure out a way to 
                            //add it to a district..
                            //Come back to add a logical step here...
                        }
                    });   
                });
            }
        }
        $scope.ClearSearch();
    }

    $scope.ClearSearch = function () {
        $scope.Contacts = [];
        $scope.Company = ""; 
        $scope.FirstName = ""; 
        $scope.LastName = "";
        $scope.SearchForm.$setPristine();
        $scope.SelectedRowId = null;
    }





}]);