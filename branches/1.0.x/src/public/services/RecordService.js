app.factory("RecordService", ['$rootScope', '$http', 'Globals', function ($rootScope, $http, Globals) {
    
    var recordsArray = [];
    var settingsArray = [];
    var apiUri = Globals.ApiUri();


    return {
        NewRecord: function(){
            var r = {
                "_id": "",
                "JobId": "",
                "ParentId": 0,
                "Paid": false,
                "Type": "Walk In",
                "IsComplete": false,
                "Requester": "5555154964146ae3a9cfbf7b",
                "WorkOrderNo": "",
                "ServicePlan": "",
                "ServicePlanExp": "",
                "Problem": "",
                "PO": "",
                "ClaimNo": "",//moved this to be a main prop from CompleteInfo
                "PaymentType": "",//this also as we need to see these props as part of main rec, not just when you complete a rec. 
                "CompleteInfo": {
                    "ActionNotes": "",
                    "RepairedBy": "",
                    "Date": ""
                },
                "Contact": {
                    "Company": "",
                    "Id": "",
                    "NameFirst": "",
                    "NameLast": "",
                    "Address": "",
                    "Address2": "",
                    "City": "",
                    "State": "",
                    "Zip": "",
                    "Phone1": "",
                    "Phone2": "",
                    "Email": ""
                },
                "Assets": [],
                "Parts": [],
                "TechNotes": [],
                "Children": [],
                "Backup": false,
                "BackupText": "",
                "DateCreated": "",
                "DateModified": ""
            };
            return r;
        },
        AddToRecordsArray: function (index, record, showSection, searchMode, pristine) {
            var settingsObj = {ShowSection: showSection, SearchMode: searchMode, Pristine: pristine};
            recordsArray.splice(index, 0, record);
            settingsArray.splice(index, 0, settingsObj);
        },
        GetRecordsArray: function () {
            return recordsArray;
        },
        GetSettingsArray: function () {
            return settingsArray;
        },
        CloseTab: function (index) {
            recordsArray.splice(index, 1);
            settingsArray.splice(index, 1);
        },
        UpdateCurrentRecord: function (index, editedRecord, showSection, searchMode, pristine) {
            recordsArray[index] = editedRecord;
            var settingsObj = {ShowSection: showSection, SearchMode: searchMode, Pristine: pristine};
            settingsArray[index] = settingsObj;
        },
        ClearRecordsArray: function () {
            recordsArray = [];
        },
        CreateRecord: function (recordObj, callback) {
            return $http.post(apiUri + '/api/records/', recordObj)
            .success(function (retval) {
                if(retval.ParentId != 0) {
                    return $http.put(apiUri + '/api/records/parents/' + retval.ParentId, {ChildId: retval._id})
                    .success(function (updatedParent) {
                        console.log(updatedParent);
                        callback(retval);
                        alert("Child Record created successfully!");
                    })
                    .error(function (error) {
                        console.log(error);
                    });
                }else {
                    callback(retval);
                    alert("Record created successfully!");
                }
            })
            .error(function (err) {
                console.log(err);
            });
        },
        CreateDistrictRecord: function (recordObj, callback) {
            return $http.post(apiUri + '/api/records/district-order', recordObj)
            .success(function (retval) {
                callback(retval);
            })
            .error(function (err) {
                console.log(err);
            });
        },
        UpdateRecord: function (recordObj, callback) {
            var RecordId = recordObj._id;
            return $http.put(apiUri + '/api/records/' + RecordId, recordObj)
            .success(function (doc) {
                console.log(doc);
                callback(doc);
            })
            .error(function (err) {
                console.log(err);
            });
        },
        GetRecordById: function (id, callback) {
            return $http.get(apiUri + '/api/records/' + id)
            .success(function (doc) {
                //console.log(doc);
                callback(doc);
            })
            .error(function (err) {
                console.log(err);
            });
        },
        GetRecordByWorkOrder: function (workOrderNo, callback) {
            return $http.get(apiUri + '/api/records/workorderno/' + workOrderNo)
            .success(function (doc) {
                //console.log(doc);
                callback(doc);
            })
            .error(function (err) {
                console.log(err);
            });
        },
        GetRecordByAsset: function (assetObj, callback) {
            if(assetObj.SerialNo != "") {
                var searchTerm = assetObj.SerialNo;
            }else {
                var searchTerm = assetObj.AssetTag
            }
            return $http.put(apiUri + '/api/records/assets/' + searchTerm, assetObj)
            .success(function (doc) {
                //console.log(doc);
                callback(doc);
            })
            .error(function (err) {
                console.log(err);
            });
        },
        GetRelatedRecs: function (id, callback) {
            return $http.get(apiUri + '/api/records/related/' + id)
            .success(function (retval) {
                callback(retval);
            })
            .error(function (err) {
                console.log(err);
            });
        },
        GetMostRecentRecord: function () {
            return _records[_records.length - 1];
        },
        GetFileMakerRecs: function () {//Not in use, but left here so I have the address of a live API or records. 
            return $http.get('http://192.168.50.201/RESTfm/Service_Department/layout/__Service.json')
            .success(function (retval) {
                
            })
            .error(function (err) {
                console.log(err);
            });
        },
        SendCompleteEmail: function (record, callback) {
            return $http.post(apiUri + '/api/emails', record)
            .then(function (retval) {
                callback(retval);
            }, function (err) {
                console.log(err);
            });
        }





    }

}]);
