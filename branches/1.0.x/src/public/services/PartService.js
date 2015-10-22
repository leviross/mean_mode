app.factory('PartService', ['$http', 'Globals', function ($http, Globals) {

    var brandArray = [];
    var currentBrand = "";
    var currentModelNo = "";
    var partsArray = [];
    var apiUri = Globals.ApiUri();

    return {
        SetModelNo: function (modelNo) {
            currentModelNo = modelNo;
        },
        CreateModel: function (brand, modelName, modelNo, callback) {
            var modelObj = {Brand: brand, ModelName: modelName, ModelNo: modelNo};
            return $http.post(apiUri + '/api/models', modelObj)
                .success(function (retval) {
                    callback(retval);
                })
                .error(function (err) {
                    console.log(err);
                });
        },
        EditModel: function (id, modelObj, callback) {
            return $http.put(apiUri + '/api/models/' + id, modelObj)
                .success(function (retval) {
                    callback(retval);
                })
                .error(function (err) {
                    console.log(err);
                });
        },
        DeleteModel: function (modelId, callback) {
            return $http.delete(apiUri + '/api/models/' + modelId)
                .success(function (retval) {
                    console.log(retval);
                    callback();
                })
                .error(function (err) {
                    console.log(err);
                });
        },
        CreatePart: function (partObj, callback) {
            return $http.put(apiUri + '/api/parts', partObj)
                .success(function (retval) {
                    callback(retval);
                    partsArray = retval.Parts;
                    //console.log(partsArray)
                })
                .error(function (err) {
                    console.log(err);
                });
        },
        EditPart: function (id, partObj, callback) {
            return $http.put(apiUri + '/api/parts/' + id, partObj)
                .success(function (retval) {
                    callback(retval);
                })
                .error(function (err) {
                    console.log(err);
                });
        },
        DeletePart: function (id) {
            return $http.delete(apiUri + '/api/parts/' + id)
                .success(function (retval) {
                    console.log(retval);
                })
                .error(function (err) {
                    console.log(err);
                });
        },
        GetModelById: function (modelId, callback) {//This is not working currently on my API, 
            return $http.get(apiUri + '/api/models/' + modelId)
                .success(function (retval) {
                    callback(retval);
                })
                .error(function (err) {
                    console.log(err);
                });
        },
        GetPartById: function (partId, callback) {
            return $http.get(apiUri + '/api/parts/' + partId)
                .success(function (retval) {
                    callback(retval);
                })
                .error(function (err) {
                    console.log(err);
                });
        },
        SearchPartNos: function (partNo, callback) {
            return $http.get(apiUri + '/api/parts/no/' + partNo)
                .success(function (retval) {
                    callback(retval);
                    //console.log(retval);
                })
                .error(function (err) {
                    console.log(err);
                });
        },
        SearchPartDesc: function (partDesc, callback) {
            return $http.get(apiUri + '/api/parts/desc/' + partDesc)
                .success(function (retval) {
                    partsArray = retval;
                    callback(retval);
                })
                .error(function (err) {
                    console.log(err);
                });
        },
        GetModelNo: function (modelNo, callback) {//Not sure when we are using this. We are not calling this
            //from PartCtrl anymore.
            return $http.get(apiUri + '/api/models/modelno/' + modelNo)
                .success(function (retval) {
                    callback(retval);
                }) 
                .error(function (err) {
                    console.log(err);
                }); 
        },//This works, but do we need to bring up all models of a certain brand ever??
        //I commented out line 260 from RecordCtrl
        GetModelsByBrand: function (brand, callback) {
            return $http.get(apiUri + '/api/models/brands/' + brand)
                .success(function (retval) {
                    callback(retval);
                    brandArray = retval;
                    currentBrand = brand;
                })
                .error(function (err) {
                    console.log(err);
                });
        },
        SearchModelNos: function (modelNo, callback) {
            return $http.get(apiUri + '/api/models/modelnos/' + modelNo)
                .success(function (retval) {
                    callback(retval);
                })
                .error(function (err) {
                    console.log(err);
                });
        },
        SearchSerialNos: function (serialNo, callback) {//rename this api/assets/serialnos/ +
            return $http.get(apiUri + '/api/assets/serialnos/' + serialNo)
                .success(function (retval) {
                    callback(retval);
                })
                .error(function (err) {
                    console.log(err);
                });
        },
        SearchTagNos: function (tagNo, callback) {
            return $http.get(apiUri + '/api/assets/tagnos/' + tagNo)
                .success(function (retval) {
                    callback(retval);
                })
                .error(function (err) {
                    console.log(err);
                });
        },
        GetBrandArray: function () {
            return brandArray;
        },
        GetPartsArray: function () {
            return partsArray;
        },
        ClearPartsArray: function () {
            partsArray = [];
        }
    }


}]);