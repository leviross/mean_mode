app.factory('ContactService', ['$http', 'Globals', function ($http, Globals) {
    var apiUri = Globals.ApiUri();

    return {
        GetContactById: function (id, callback) {
            return $http.get(apiUri + '/api/contacts/' + id)
            .success(function (retval) {
                callback(retval);
            })
            .error(function (err) {
                console.log(err);
            });
        },
        GetContactByFirst: function (FirstName, callback) {
            return $http.get(apiUri + '/api/contacts/firstname/' + FirstName, {cache: false})
            .success(function (retval) {
                callback(retval);
            })
            .error(function (err) {
                console.log(err);
            });
        },
        GetContactByLast: function (LastName, callback) {
            return $http.get(apiUri + '/api/contacts/lastname/' + LastName, {cache: false})
            .success(function (retval) {
                callback(retval);
            })
            .error(function (err) {
                console.log(err);
            });
        },
        GetContactByCompany: function (Company, callback) {
            return $http.get(apiUri + '/api/contacts/company/' + Company, {cache: false})
            .success(function (retval) {
                callback(retval);
            })
            .error(function (err) {
                console.log(err);
            });
        },
        GetContactByFullName: function (FullName, callback) {
            return $http.get(apiUri + '/api/contacts/fullname/' + FullName, {cache: false})
            .success(function (retval) {
                callback(retval);
            })
            .error(function (err) {
                console.log(err);
            });
        },
        GetContactByAllFields: function (AllFields, callback) {
            return $http.get(apiUri + '/api/contacts/allfields/' + AllFields, {cache: false})
            .success(function (retval) {
                callback(retval);
            })
            .error(function (err) {
                console.log(err);
            });
        },
        GetContactByAnyField: function (AnyField, callback) {
            return $http.get(apiUri + '/api/contacts/anyfield/' + AnyField, {cache: false})
            .success(function (retval) {
                callback(retval);
            })
            .error(function (err) {
                console.log(err);
            });
        },
        GetCompaniesByType: function (districtName, callback) {
            return $http.get(apiUri + '/api/contacts/types/' + districtName)
            .success(function (retval) {
                callback(retval);
            })
            .error(function (err) {
                console.log(err);
            });
        },
        UpdateContactRecord: function (updatedContact, callback) {
            return $http.put(apiUri + '/api/contacts/' + updatedContact._id, updatedContact)
            .success(function (retval) {
                console.log("Updated the contact successfully!", retval);
                callback(retval);
                alert("Contact updated!");
            })
            .error(function (err) {
                console.log(err);
            });
        }, 
        CreateNewContact: function (NewContact) {
            return $http.post(apiUri + '/api/contacts', NewContact)
            .success(function (retval) {
                console.log(retval);
            })
            .error(function (err) {
                console.log(err);
            });
        }


    }


}]);