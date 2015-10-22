app.factory("Globals", ['$rootScope', '$http', function ($rootScope, $http) {
 
    var RecordId = null;
    var TaxRate = 0;
    var variables = ["jobnumber", "technician", "workorder", "lastname", "firstname", "company", "actiontaken"];
    var apiUri = '';
    var webServerUri = '';

    return {

        EmailTemplate: function () {
            return "<<Technician>> has finished repairing ticket number <<JobNumber>>, located at <<Company>>.\n\nAction taken: \n\n<<ActionTaken>>\n\n\nThank you!\nThe MicroK12 Service Department."
        },
        EmailVariables: function () {
            return variables;
        },
        GetTaxRateVar: function () {
            return TaxRate;
        },
        GetTaxRate: function (callback) {
            if(TaxRate == 0) {
                return $http.get(apiUri + '/api/settings/TaxRate')
                .success(function (doc) {
                    callback(doc.Value);
                    TaxRate = doc.Value;
                })
                .error(function (err) {
                    console.log(err);
                });
            }else {
                return TaxRate;
            }
        },
        SetTaxRate: function (newRate, callback) {
            return $http.put(apiUri + '/api/settings/TaxRate', newRate)
            .success(function (doc) {
                console.log(doc);
                callback(doc);
            })
            .error(function (err) {
                console.log(err);
            });
        },
        SetRecordId: function (newRecordId) {
            RecordId = newRecordId;
        },
        GetRecordId: function () {
            var SendRecordId = RecordId;
            RecordId = null;
            return SendRecordId;
        },
        ApiUri: function () {
            //var uri = 'http://192.168.50.192/mcs';
            var uri = 'http://localhost:4000';
            apiUri = uri;
            return uri;
        },
        WebServerUri: function () {
            var uri = 'http://localhost:3030';
            webServerUri = uri;
            return uri;
        },
        //TODO: Monitor which type belongs to which company
        RepairTypes: function () {
            return [
                { name: "Bishop Blanchet", id: 21, value: "Bishop Blanchet" },
                { name: "Clover Park", id: 25, value: "Clover Park" },
                { name: "Drop Ship", id: 17, value: "Drop Ship" },
                { name: "Everett", id: 2, value: "Everett" },
                { name: "Evergreen", id: 8, value: "Evergreen" },
                { name: "Highline", id: 22, value: "Highline" },
                { name: "Kent", id: 3, value: "Kent" },
                { name: "Kent Installation", id: 6, value: "Kent Installation" },
                { name: "King County Library", id: 18, value: "King County Library" },
                { name: "Lakeside", id: 4, value: "Lakeside" },
                { name: "Lake WA", id: 26, value: "Lake WA" },
                { name: "Marysville", id: 29, value: "Marysville" },
                { name: "Mail in", id: 12, value: "Mail in" },
                { name: "Renton", id: 15, value: "Renton" },
                { name: "Seattle", id: 27, value: "Seattle" },
                { name: "Shoreline", id: 5, value: "Shoreline" },
                { name: "Snohomish", id: 13, value: "Snohomish" },
                { name: "Sumner", id: 14, value: "Sumner" },
                { name: "Tahoma", id: 10, value: "Tahoma" },
                { name: "Tukwila", id: 9, value: "Tukwila" },
                { name: "Tumwater", id: 24, value: "Tumwater" },
                { name: "Warehouse", id: 31, value: "Warehouse" },
                { name: "Walk In", id: 1 , value: "Walk In" },
                { name: "Website", id: 32, value: "Website" }  
            ];
        },
        DistrictNames: function () {
            return ["Bishop Blanchet", "Clover Park", "Everett", "Evergreen", "Highline", "Kent", "Kent Installation", 
            "King County Library", "Lakeside", "Lake WA", "Marysville", "Renton", "Seattle", "Shoreline", 
            "Snohomish", "Sumner", "Tahoma", "Tukwila", "Tumwater"];
        },
        Brands: function () {
            return [
                {name: "Acer"},
                {name: "Apple"},
                {name: "Elmo"},
                {name: "Epson"},
                {name: "HP"},
                {name: "HP Printer"},
                {name: "Lenovo"},
                {name: "Samsung"},
                {name: "Toshiba"}
            ]
        },
        SearchFields: function () {
            return [
                {name: "JobId"}, 
                {name: "WorkOrderNo"}, 
                {name: "SerialNo"}, 
                {name: "AssetTag"}
            ];
        },
        Users: function (callback) {
            return $http.get(apiUri + '/api/users')
            .success(function (users) {
                callback(users);
            })
            .error(function (err) {
                console.log(err);
            });

        }
    }

}]);