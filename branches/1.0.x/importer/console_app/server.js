var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
// parse application/json
app.use(bodyParser.json());
app.use(cors());

var mongoose = require('mongoose');
mongoose.connect('mongodb://magicdbadmin:magicdbadminpassword@192.168.50.21:27017/magicdb', function (err){
	if(err) {
		console.log(err);
	}
});
var recordCtrl = require('./controllers/record');
var assetCtrl = require('./controllers/asset');
var modelCtrl = require('./controllers/model');
var partCtrl = require('./controllers/part');
var contactCtrl = require('./controllers/contact');
var Record = require('./models/record');
var Counter = require('./models/counter');
var Asset = require('./models/asset');
var Model = require('./models/model');
var Part = require('./models/part');
var Contact = require('./models/contact');


var fs = require('fs');
var contents = fs.readFileSync('test.txt').toString();
var lines = contents.split('\n');
console.log(lines.length);





var usersArr = [];
/*var line = 0;
(function loop() {
    if(line < 100) {
        console.log(techGuys(lines[line]));

        if(usersArr.indexOf( techGuys(lines[line][3]) ) {

        })
        line++;
        loop();
    }
}());*/


function techGuys(line) {
    var eachLine = line.replace('","', '"",""');
    eachLine = eachLine.replace(/\v/g, '\n');  
    eachLine = eachLine.replace(/\u001d/g, '');

    var eachLineArr = eachLine.split('","'); 

    eachLineArr[0].replace(/"/g,"");
    eachLineArr[1].replace(/"/g,"");
    eachLineArr[10].replace(/"/g, "");

    return eachLineArr;
}
// var reqArr = [];

// var line = 0;
// var counter = 0;
// (function loop() {
//     if(line < lines.length) {
//         console.log( reqArr.indexOf(requesters(lines[line][3])) > -1 );
//         line++;
//         loop();

//         if( (requesters(lines[line])[1].split(',').length ) > 1 ) {
//             counter++;
//             console.log(requesters(lines[line])[1]);
//             console.log(counter);
//             line++;
//             loop();
//         }else {
//             line++;
//             loop();
//         }

//         var eachLineArr = requesters(lines[line]);
//         var reqId = eachLineArr[3];
//         if( reqArr.indexOf(reqId) == -1 ) {
//             reqArr.push(reqId);
//             line++;
//             loop();
//         }else {
//             line++;
//             loop();
//         }
        
//     }
// }());
// console.log("Length is: ",reqArr.length);
// console.log(reqArr);
function requesters (line) {
   
    var eachLine = line.replace('","', '"",""');

    eachLine = eachLine.replace(/\v/g, '\n');  
    eachLine = eachLine.replace(/\u001d/g, '');

    var eachLineArr = eachLine.split('","'); 

    eachLineArr[0].replace(/"/g,"");
    eachLineArr[1].replace(/"/g,"");
    eachLineArr[10].replace(/"/g, "");

    return eachLineArr;
}

 
// contactCtrl.dropContacts("empty req", function (retval) {
//     console.log(retval);
// });
// contactCtrl.initCounter("empty req", function (retval) {
//     console.log(retval);
// });




//var line = 100;
//loopContacts();

function loopContacts () {
    if(line < 101) {
        //Some lines have all commas and no data, I skip those lines if the first field is a comma
        if(lines[line][0] == ',') {
            line++;
            loopContacts();
        }else {
            var fullContactObj = importContacts(lines[line]);

            function importContacts (line) {
                //Step 1: I always do a manual find and replace all on the actual file, 
                //search for '\x0' which is NULL and replace all with empty string! 
                //Then in code, replace all double quotes with a comma in between (end of a field) with 2 sets of double quotes
                //Since there are commas in the text fields, we cant simply split the text on a comma. We have to add these 2 sets of double quotes so 
                //we can split on that
                var eachLine = line.replace('","', '"",""');

                //we replace all '\v' which are VT - vertical tabs
                eachLine = eachLine.replace(/\v/g, '\n');  
                //we replace all '\u001d' which are GS - global spaces
                eachLine = eachLine.replace(/\u001d/g, '');
                //we split on 1 set of double quotes with a comma in between, so now we will have the correct amount of fields
                var eachLineArr = eachLine.split('","'); 
                //for some reason, the data came out bad and on the first 2 fields and the last field of every import, I had 
                //to erase a single double quote that was extra
                var first = eachLineArr[0].replace(/"/g,"");
                eachLineArr[0] = first;
                var second = eachLineArr[1].replace(/"/g,"");
                eachLineArr[1] = second;
                var twenty = eachLineArr[20].replace(/"/g, "");
                eachLineArr[20] = twenty;


                var Contact = {
                    OldId: parseFloat(eachLineArr[8]),
                    Address: eachLineArr[0],
                    Address2: eachLineArr[1],
                    City: eachLineArr[2],
                    State: eachLineArr[17],
                    Zip: eachLineArr[20],
                    NameFirst: eachLineArr[9],
                    NameLast: eachLineArr[11],
                    Company: eachLineArr[3],
                    Email: eachLineArr[7],
                    Password: "",
                    Phone1: eachLineArr[13],
                    Phone1Type: eachLineArr[14],
                    Phone2: eachLineArr[15],
                    Phone2Type: eachLineArr[16],
                    Type: eachLineArr[19],
                    DateCreated: eachLineArr[5],
                    DateModified: eachLineArr[6]
                }
                return Contact;
            }


            contactCtrl.postContact(fullContactObj, function (retval) {
                console.log(retval);
                line++;
                loopContacts();
             });
        }
       
    }
};




//var line = 100;
//loopTechNotes();

function loopTechNotes () {
    if(line < 101) {
        if(lines[line][0] === ',') {
            line++;
            loopTechNotes();
        }else {
            var techNoteObject = techNotes(lines[line]);

            function techNotes(line) {
                var eachLine = line.replace('","', '"",""');
                eachLine = eachLine.replace(/\v/g, '\n');  
                eachLine = eachLine.replace(/\u001d/g, '');

                var eachLineArr = eachLine.split('","'); 

                var first = eachLineArr[0].replace(/"/g,"");
                eachLineArr[0] = first;

                var second = eachLineArr[1].replace(/"/g,"");
                eachLineArr[1] = second;
                eachLineArr[8].replace(/"/g, "");

                if(eachLineArr[5] != "") {
                    var note = eachLineArr[5] + '\n' + eachLineArr[4];
                }else {
                    var note = eachLineArr[4];
                }

                var Note = {
                    JobId: eachLineArr[3],
                    Note: note,
                    Tech: eachLineArr[6],
                    Date: eachLineArr[0],
                    DateModified: eachLineArr[1]
                }
                return Note;
            }

            recordCtrl.sendTechNotes(techNoteObject, function(newRec) {
                console.log(newRec);
                line++;
                loopTechNotes();
            });
        }    
    }
};




//maybe dont take out the $ sign. other parts have it. also, keep checking for dups all over the place. 


//var line = 0;
//loopRetailParts();
//DONT FORGET TO ADD 6000 TO THE JOB# !!!!!
function loopRetailParts() {
    if(line < 100) {
        if(lines[line][0] === ',') {
            line++;
            loopRetailParts();
        }else {

            var retailPartObj = retailParts(lines[line]);

            function retailParts(line) {
                var eachLine = line.replace('","', '"",""');
                eachLine = eachLine.replace(/\v/g, '\n');  
                eachLine = eachLine.replace(/\u001d/g, '');

                eachLine = eachLine.replace("$", "");

                var eachLineArr = eachLine.split('","'); 

                var first = eachLineArr[0].replace(/"/g,"");
                eachLineArr[0] = first;
                eachLineArr[1].replace(/"/g,"");
                eachLineArr[11].replace(/"/g, "");

                if(eachLineArr[11] != "") {
                    var qty = parseFloat(eachLineArr[11]);
                }else {
                    var qty = 0;
                }

                if(eachLineArr[0] != "") {
                    var cost  = parseFloat(eachLineArr[0]);
                }else {
                    var cost = 0;
                }
                if(eachLineArr[9] != "") {
                    var price = parseFloat(eachLineArr[9]);
                }else {
                    var price = 0;
                }

                var Part = {
                    JobId: eachLineArr[6],
                    ItemType: "retail",
                    Hide: false,
                    OrderNo: "",
                    ServiceType: "",
                    OrderedBy: "",
                    OrderedOn: eachLineArr[2],
                    Qty: qty,
                    PartNo: eachLineArr[8],
                    Desc: eachLineArr[4],
                    Cost: eachLineArr[0],//cost,
                    Price: price,
                    ShippingCost: 0,
                    Esc: false,
                    ShippingInfo: {
                        SentBy: "",
                        SentOn: "",
                        TrackingNo: ""
                    },
                    ReceivingInfo: {
                        ReceivedBy: "",
                        ReceivedOn: ""
                    }
                }

                return Part;
            }

            recordCtrl.updateParts(retailPartObj, function(newRec) {
                console.log(newRec);
                line++;
                loopRetailParts();
            });
        }
    }
}



var line = 0;
function loopLaborParts () {
    if (line <  100) {
        if(lines[line][0] === ',') {
            line++;
            loopLaborParts();
        }else {
            var fullLaborPartObj = laborParts(lines[line]);

            function laborParts(line) {
                var eachLine = line.replace('","', '"",""');
                eachLine = eachLine.replace(/\v/g, '\n');  
                eachLine = eachLine.replace(/\u001d/g, '');

                eachLine = eachLine.replace("$", "");

                var eachLineArr = eachLine.split('","'); 

                var first = eachLineArr[0].replace(/"/g,"");
                eachLineArr[0] = first;
                
                var second = eachLineArr[1].replace(/"/g,"");
                eachLineArr[1] = second;
                eachLineArr[9].replace(/"/g, "");


                if(eachLineArr[9] != "") {
                    var qty = parseFloat(eachLineArr[9]);
                }else {
                    var qty = 0;
                }

                if(eachLineArr[2] != "") {
                    var cost  = parseFloat(eachLineArr[2])
                }else {
                    var cost = 0;
                }
                if(eachLineArr[7] != "") {
                    var price = parseFloat(eachLineArr[7]);
                }else {
                    var price = 0;
                }

                var Part = {
                    JobId: eachLineArr[1],
                    ItemType: "labor",
                    Hide: false,
                    OrderNo: "",
                    ServiceType: "",
                    OrderedBy: "",
                    OrderedOn: eachLineArr[3],
                    Qty: qty,
                    PartNo: eachLineArr[6],
                    Desc: eachLineArr[5],
                    Cost: cost,
                    Price: price,
                    ShippingCost: 0,
                    Esc: false,
                    ShippingInfo: {
                        SentBy: "",
                        SentOn: "",
                        TrackingNo: ""
                    },
                    ReceivingInfo: {
                        ReceivedBy: "",
                        ReceivedOn: ""
                    }
                }
                return Part;  
            }




            recordCtrl.updateParts(fullLaborPartObj, function(newRec) {
                console.log("UPDATED RECORD:", newRec);
                line++;
                loopLaborParts();
            });
        }
    }
}




//var line = 0;
//loopServiceParts();
function loopServiceParts () {
    if(line < 100) {
        if(lines[line][0] === "," || lines[line][1] == '"') {
            line++;
            loopServiceParts();
        }else {
            var fullServicePartObj = getParts(lines[line]);
            function getParts(line) {
                //Step 1: I always do a manual find and replace all on the actual file, 
                //search for '\x0' which is NULL and replace all with empty string! 
                //Then in code, replace all double quotes with a comma in between (end of a field) with 2 sets of double quotes
                //Since there are commas in the text fields, we cant simply split the text on a comma. We have to add these 2 sets of double quotes so 
                //we can split on that
                var eachLine = line.replace('","', '"",""');
                //we replace all '\v' which are VT - vertical tabs
                eachLine = eachLine.replace(/\v/g, '\n');  
                //we replace all '\u001d' which are GS - global spaces
                eachLine = eachLine.replace(/\u001d/g, '');
                //we split on 1 set of double quotes with a comma in between, so now we will have the correct amount of fields
                var eachLineArr = eachLine.split('","'); 
                //for some reason, the data came out bad and on the first 2 fields and the last field of every import, I had 
                //to erase a single double quote that was extra
                var first = eachLineArr[0].replace(/"/g,"");
                eachLineArr[0] = first;
                eachLineArr[1].replace(/"/g,"");
                eachLineArr[19].replace(/"/g, "");

                if(eachLineArr[9] == "") {
                    var Hide = false;
                }else {
                    var Hide = true;
                }
                if(eachLineArr[10] == "") {
                    var Esc = false;
                }else {
                    var Esc = true;
                }
                if(eachLineArr[15].length < 8) {
                    var TrackingNum = "";
                }else {
                    var TrackingNum = eachLineArr[15];
                }

                if(eachLineArr[2] != "") {
                    var qty = parseFloat(eachLineArr[2]);
                }else {
                    var qty = 0;
                }

                if(eachLineArr[5] != "") {
                    var cost  = parseFloat(eachLineArr[5])
                }else {
                    var cost = 0;
                }
                if(eachLineArr[6] != "") {
                    var price = parseFloat(eachLineArr[6]);
                }else {
                    var price = 0;
                }
                if(eachLineArr[7] != "") {
                    var shippingCost = parseFloat(eachLineArr[7]);
                }else {
                    var shippingCost = 0;
                }
                

                var Part = {
                    JobId: eachLineArr[0],
                    ItemType: "service",
                    Hide: Hide,
                    OrderNo: eachLineArr[1],
                    ServiceType: eachLineArr[11],
                    OrderedBy: eachLineArr[12],
                    OrderedOn: eachLineArr[8],
                    Qty: qty,
                    PartNo: eachLineArr[3],
                    Desc: eachLineArr[4],
                    Cost: cost,
                    Price: price,
                    ShippingCost: shippingCost,
                    Esc: Esc,
                    ShippingInfo: {
                        SentBy: eachLineArr[19],
                        SentOn: eachLineArr[18],
                        TrackingNo: TrackingNum
                    },
                    ReceivingInfo: {
                        ReceivedBy: eachLineArr[13],
                        ReceivedOn: eachLineArr[14]
                    }
                }
                return Part;
            }



            recordCtrl.updateParts(fullServicePartObj, function(newRec) {
                console.log("UPDATED RECORD:", newRec);
                line++;
                loopServiceParts();
            });
        }
    }
}




// var line = 10; 

// (function loop() {
//     if(line < 102) {
        
//         if(lines[line][0] === ",") {
//             console.log("Skipped, not a full Object...");
//             line++;
//             loop();
//         }else {
//             var fullPartObj = getPartInfo(lines[line]);

//             if(fullPartObj == null) {
//                 console.log("Skipped, not a full Object...");
//                 line++;
//                 loop();
//             }else {
                
//                 modelCtrl.postModel(fullPartObj, function (message, retval) {
//                     console.log(message, retval);
//                     fullPartObj.Model = retval;

//                     partCtrl.postPart(fullPartObj, function (message, retval) {
//                         console.log(message, retval);
//                         line++;
//                         loop();
//                     });
                    
//                 });
//             }
//         }

//     }
// }());

// (function initCounter () {
//     partCtrl.initCounter();
// }());


// assetCtrl.dropAssets(function (retval) {
//     console.log(retval);
// });
// modelCtrl.dropModels(function (retval) {
//     console.log(retval);
// });
// partCtrl.dropParts(function (retval) {
//     console.log(retval);
// });
// var id = {_id: "55a92fda84714f6d74a35673"};
// (function loop() {
//     modelCtrl.findOne(id, function (retval) {
//         console.log(retval);
//     });
// }());

function getPartInfo(line) {    
    var eachLine = line.replace('","', '"",""');
    eachLine = eachLine.replace(/\v/g, '');
    eachLine = eachLine.replace(/\u001d/g, '');

    var eachLineArr = eachLine.split('","');


    var first = eachLineArr[0].replace(/"/g,"");
    eachLineArr[0] = first;
    var second = eachLineArr[1].replace(/"/g,"");
    eachLineArr[1] = second;
    var sixth = eachLineArr[6].replace(/"/g, "");
    eachLineArr[6] = sixth;

    if(eachLineArr[6] == "Labor") { 
        return null;
    }else if(eachLineArr[0] == "") {
        return null;
    }else if(eachLineArr[3] == "") {
        return null;
    }else if(eachLineArr[4] == "") {
        return null;
    }

    var modelSchemaObj = {
        Brand: eachLineArr[0],
        ModelName: eachLineArr[3].toUpperCase(),
        ModelNo: eachLineArr[4].toUpperCase(),
        PartNo: eachLineArr[5].toUpperCase(),
        PartDesc: eachLineArr[1]
    }

    return modelSchemaObj; 

}

//we take each Model Object and search our Model Collection. 
//1 - If we dont find the Model # in our DB, then we CREATE a new Doc with that Model # and put Parts in the Array
//2 - If we DO find that Model # already, then we do another check and see if the attached Part # is already on the Parts Array. 
//If it already is there, we do NOTHING. 
//If its not in Parts Array, then we add it! 


// assetCtrl.findAll(function (retval) {
//     console.log("ASSET COLLECTION SHOULD BE EMPTY----", retval);
// });
// modelCtrl.findAll(function (retval) {
//     console.log("ASSET COLLECTION SHOULD BE EMPTY----", retval);
// });

// var line = 1;

// (function loop() { //file is 42000-End RegRecTable in Docs...
//     if(line < 100) {


//         var fullAssetObj = getAssetInfo(lines[line]);
//         if(fullAssetObj == null) {
//             console.log("Not good data, skipped...");
//             line++;
//             loop();
//         }else {
//             var assetObj = {
//                 TagNo: fullAssetObj.TagNo,
//                 SerialNo: fullAssetObj.SerialNo
//             }

//             var brandObj = {
//                 Brand: fullAssetObj.Brand,
//                 ModelName: fullAssetObj.ModelName,
//                 ModelNo: fullAssetObj.ModelNo
//             }

//             modelCtrl.postModel(brandObj, function (message, modelRetVal) {
//                 console.log(message, modelRetVal);
//                 assetObj.ModelId = modelRetVal._id;

//                 assetCtrl.postAsset(assetObj, function (retval) {
//                     console.log(retval);
//                     line++;
//                     loop();
//                 });
            
//             });
//         }

        
//     }
// }());



function getAssetInfo(line) {
    var eachLine = line.replace('","', '"",""');
    eachLine = eachLine.replace(/\v/g, '');  
    eachLine = eachLine.replace(/\u001d/g, '');

    var eachLineArr = eachLine.split('","');
    
    eachLineArr[0].replace(/"/g,"");
    eachLineArr[1].replace(/"/g,"");
    eachLineArr[48].replace(/"/g, "");

    if(eachLineArr[21] == "") {
        return null;
    }else if(eachLineArr[22] == "") {
        return null;
    }else if(eachLineArr[34] == "") {
        return null;
    }else if(eachLineArr[34] == "N/A") {
        return null;
    }else if(eachLineArr[5] == "") {
        return null;
    }
    //TODO: go to the file and change these with a replace all, erase this code...
    if(eachLineArr[5] == "IBM") {
        var brand = "Lenovo";
        var modelName = eachLineArr[21].replace(/[ -]/g, "").toUpperCase();
        //console.log("REPLACED THE HYPHEN AND CHANGED BRAND TO LENOVO");
        if(eachLineArr[22].length == 7) {
            console.log("Hit this If statement...");
            eachLineArr[22][3] == '-';
            var modelNo = (eachLineArr[22].substr(0, 4) + '-' + eachLineArr[22].substr(4)).toUpperCase();
        }else {
            var modelNo = eachLineArr[22].toUpperCase();
        }
    }else if(eachLineArr[5] == "IBM / Lenovo") {
        var brand = "Lenovo";
        var modelName = eachLineArr[21].replace(/[ -]/g, "").toUpperCase();
        if(eachLineArr[22].length == 7) {
            console.log("Hit this If statement...");
            eachLineArr[22][3] == '-';
            var modelNo = eachLineArr[22];
        }else {
            var modelNo = eachLineArr[22];
        }
        
    }else if(eachLineArr[5] == "HP / Compaq") {
        var brand = "HP";
        var modelName = eachLineArr[21].toUpperCase();
        var modelNo = eachLineArr[22].toUpperCase();
    }else if(eachLineArr[5] == "Toshiba") {
        var brand = eachLineArr[5];
        var modelName = eachLineArr[21].replace(/_/g, " ").toUpperCase();
        var modelNo = eachLineArr[22].toUpperCase();
    }else {
        var brand = eachLineArr[5];
        var modelName = eachLineArr[21].toUpperCase();
        var modelNo = eachLineArr[22].toUpperCase();
    }

    var modelSchemaObj = {
        Brand: brand,
        ModelName: modelName,
        ModelNo: modelNo, 
        SerialNo: eachLineArr[34].toUpperCase(),
        TagNo: eachLineArr[4]
    }

    return modelSchemaObj; 

}
// var line = 0;
// (function loop() {
//     if(line < 100) {
//         // var rec = mainRecord(lines[line]);
//         // var backup = rec.Backup;
//         // var backuptext = rec.BackupText;
//         // //console.log(backup);
//         // console.log(rec);
//         // line++;
//         // loop();

//         recordCtrl.postNewRecord(mainRecord(lines[line]), function (newRec) {
//             console.log(newRec);
//             line++;
//             loop();
//         });
//     }
// }());

function mainRecord(line) {
    //Step 1: I always do a manual find and replace all on the actual file, 
    //search for '\x0' which is NULL and replace all with empty string! 
    //Then in code, replace all double quotes with a comma in between (end of a field) with 2 sets of double quotes
    //Since there are commas in the text fields, we cant simply split the text on a comma. We have to add these 2 sets of double quotes so 
    //we can split on that
   	var eachLine = line.replace('","', '"",""');
    //we replace all '\v' which are VT - vertical tabs
	eachLine = eachLine.replace(/\v/g, '\n');  
    //we replace all '\u001d' which are GS - global spaces
	eachLine = eachLine.replace(/\u001d/g, '');
    //we split on 1 set of double quotes with a comma in between, so now we will have the correct amount of fields
	var eachLineArr = eachLine.split('","');
	//for some reason, the data came out bad and on the first 2 fields and the last field of every import, I had 
    //to erase a single double quote that was extra
	eachLineArr[0].replace(/"/g,"");
	eachLineArr[1].replace(/"/g,"");
	eachLineArr[48].replace(/"/g, "");

    //If DateCompleted has a date in it, they were completed and paid
	if(eachLineArr[15] != "") {
		var wasCompleted = true;
		var wasPaid = true;
	}else {
		var wasCompleted = false;
		var wasPaid = false;
	}
    //If DataBackup is a "Yes" then Backup is true
	if(eachLineArr[13] == "Yes") {
		var isBackedUp = true;
        var backUpText = eachLineArr[14];
	}else {
        var isBackedUp = false;
        var backUpText = "";
    }


    //var DateAndTimeReceived = eachLineArr[16] + " " + eachLineArr[43]; not using this any more


	var OurSchemaObj = {
		JobId: parseFloat(eachLineArr[19]),
        ParentId: 0,
        Children: [],
        Paid: wasPaid, 
        Type: eachLineArr[32], //31 is type and 32 is typetext, maybe combine the two??
        IsComplete: wasCompleted, 
        Requester: "",//eachLineArr[33],//maybe change this to 'website' so that we are not random requester numbers
        WorkOrderNo: eachLineArr[47],
        ServicePlan: eachLineArr[37], 
        ServicePlanExp: eachLineArr[35],
        Problem: eachLineArr[30],
        PO: eachLineArr[36],
        TaxRate: eachLineArr[42],
        TechNotes: [],
        ClaimNo: eachLineArr[8],
        PaymentType: eachLineArr[44],
        CompleteInfo: {
            ActionNotes: eachLineArr[1],
            RepairedBy: eachLineArr[11],  //this should correspond to 'CompletedBy' ???
            Date: eachLineArr[15],
            ClaimDate: eachLineArr[7]
        },
        Contact: {
            Company: eachLineArr[10],
            _id: eachLineArr[12],
            NameFirst: eachLineArr[23],
            NameLast: eachLineArr[24],
            Address: eachLineArr[2],
            Address2: eachLineArr[3],
            City: eachLineArr[6],
            State: eachLineArr[40],
            Zip: eachLineArr[48],
            Phone1: eachLineArr[26],
            Phone2: eachLineArr[28],
            Email: eachLineArr[17]
        },
        Assets: [{ 
        	Brand: eachLineArr[5],
        	ModelName: eachLineArr[21].toUpperCase(),
        	ModelNo: "", 
        	SerialNo: eachLineArr[34].toUpperCase(),
        	AssetTag: eachLineArr[4].toUpperCase()
        }, {
        	Brand: "",
        	ModelName: "Accessories:",
        	ModelNo: eachLineArr[0], 
        	SerialNo: "",
        	AssetTag: ""
        }],
        Parts: [], // the parts array is going to be done from a 2nd export file
        Backup: isBackedUp,
        BackupText: backUpText,
        DateCreated: eachLineArr[16] ,
        DateModified: ""
        //also have a lot of fields from FM that we arent saving so far, totals, lots of stuff. 
        //check out what they are and where to save them.
        //For example: DateCompleted. Where should we put that on our Schema??
	}
	return OurSchemaObj;
}

//RECORD CREATION PATHS: 
//SO FAR THERE ARE 3 POSSIBLE ORDER TYPES: Walk in, On Site, Web Site. 
//We only need to know the district if it is an On Site order. If its Walk In, it will be the walk in user. The tech selects themselves as the tech for that order. 
//Ask Topher what diff scenarios there are. If its a walk in, then we need a requester, is that right? 
//If its a web order, then we know what type it is. if its an on site order, bla bla. 
//Are all of those districts considered the same thing?? What is drop ship? What is mail in? warehouse? 
//Is there a better way we can handle these types??
//For serial #, it would be great if that can be entered and model #, part # and brand can be auto filled.
//If they enter asset tag, then we can make a DB call to see if that was entered prev, and then get serial # and stuff from there.
//Add parentID for new records. 
//if there is a WO #, does that mean that there is a PO # as well??
	

var port = process.env.PORT || 1337;
var router = express.Router();

app.listen(port);
console.log('Listening on port 1337');





