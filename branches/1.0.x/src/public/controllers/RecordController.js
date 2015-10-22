app.controller('RecordController', ['$scope', '$rootScope', '$routeParams', '$location', 'Globals', 'RecordService', 'UserService', 'PartService', '$filter', function ($scope, $rootScope, $routeParams, $location, Globals, RecordService, UserService, PartService, $filter) {

    $scope.Record = null;
    $scope.SearchMode = true;
    $scope.User = UserService.GetUser();
    $scope.ChooseExpDate = false;
    $scope.RepairTypes = Globals.RepairTypes();
    $scope.Brands = Globals.Brands();

    var CurrentNoteIndex = 0;
    $scope.ShowSection = 1;
    $scope.NoteLimit = 3;
    var CurrentRecordIndex = null;

    var taxRate = Globals.GetTaxRateVar();
    $scope.TaxRate = taxRate;

    var SetRecordIndex = function (index) {
        CurrentRecordIndex = index;
    }

    $scope.ChangeTaxRate = function () {
        taxRate = $scope.TaxRate;
    }

    $scope.Print = function () {
        $rootScope.$broadcast('PrintPage', "Record", $scope.Record, false);
    }
    //keyboard shortcut to print a record
    Mousetrap.bind(['ctrl+p', 'command+p'], function (e) {
        if(e.preventDefault) {
            e.preventDefault();
        }else {
            e.returnValue = false;
        }

        var data = {Record: $scope.Record, Totals: $scope.Totals}
        $rootScope.$broadcast('PrintPage', "Record", data, false);
        
    });

    Globals.GetTaxRate(function (rate) {
        $scope.TaxRate = rate;
        taxRate = rate;
    });
        
    Globals.Users(function (usersArray) {
        $scope.Users = usersArray;
        console.log(usersArray);
    });   
    //keyboard shortcut to open contacts modal
    Mousetrap.bind(['ctrl+k', 'command+k'], function (e) {
        if(e.preventDefault) {
            e.preventDefault();
        }else {
            e.returnValue = false;
        }
        $scope.FindContact();
    })

    $scope.FirstSection = function () {
        if($scope.Record.Requester && $scope.Record.Type) {
            $scope.ShowSection++;
        }
    }
    $scope.SecondSection = function () {
        if($scope.Record.Contact._id) {
            $scope.ShowSection++;
        }
    }
    $scope.ThirdSection = function () {
        if($scope.Record.ServicePlan && $scope.Record.Problem) {
            $scope.ShowSection++;
        }
    }
    //keyboard shortcut to update or create new record
    Mousetrap.bind(['ctrl+s', 'command+s'], function (e) {
        if(e.preventDefault) {
            e.preventDefault();
        }else {
            e.returnValue = false;
        }
        if($scope.Record._id && $scope.RecordForm.$dirty) {
            $scope.UpdateRecord();
        }else if($scope.RecordForm.$dirty && $scope.RecordForm.$valid) {
            $scope.CreateNewRecord();
        }else {
            alert("You haven't made any edits to this job yet.");
        }
    });


    $scope.CreateNewRecord = function () {

        var paymentType = $scope.Record.PaymentType || "";
        var NewRecordDetails = {
            ParentId: $scope.Record.ParentId,
            Paid: $scope.Record.Paid,
            Type: $scope.Record.Type,
            IsComplete: $scope.Record.IsComplete,
            Requester: $scope.Record.Requester,
            WorkOrderNo: $scope.Record.WorkOrderNo,
            ServicePlan: $scope.Record.ServicePlan,
            ServicePlanExp: $scope.Record.ServicePlanExp,
            Problem: $scope.Record.Problem,
            PO: $scope.Record.PO,
            PaymentType: paymentType,
            ClaimNo: $scope.Record.ClaimNo,
            Backup: $scope.Record.Backup,
            BackupText: $scope.Record.BackupText,
            CompleteInfo: $scope.Record.CompleteInfo,
            Contact: $scope.Record.Contact,
            Assets: $scope.Record.Assets,
            Parts: $scope.Record.Parts,
            TechNotes: $scope.Record.TechNotes
        }

        RecordService.CreateRecord(NewRecordDetails, function (newRecord) {
            Globals.SetRecordId(newRecord._id);
            $scope.Record = newRecord;
            $scope.RecordForm.$setPristine();
            $scope.SearchMode = true;
            $rootScope.$broadcast('SetNavSearch', newRecord._id);
            $scope.$broadcast('EnableNavButtons');
            $rootScope.$broadcast('ShowRecord');
            $scope.ShouldWeShowNotesButton(newRecord);
            //TODO: update the parent rec properly, there is a bug, 
            //when you select parent rec tab, it doenst update the scope, fix! 
            if(newRecord.ParentId !== 0) {
                var recordsArray = RecordService.GetRecordsArray();
                recordsArray.forEach(function (rec, index) {
                    if(rec._id === newRecord.ParentId) {
                        rec.Children.push({Id: newRecord._id});
                        RecordService.UpdateCurrentRecord(index, rec, 4, true, true);
                    }
                });
            }
        });
        
    }

    $scope.DiscardRecord = function () {
        $scope.Record = RecordService.NewRecord();
        $scope.RecordForm.$setPristine();
        $scope.ShowSection = 1;
    }
    //this is a repeat of ctrl 's', delete this. both create and update are being handles from that
    Mousetrap.bind(['ctrl+u', 'command+u'], function (e) {
        if(e.preventDefault) {
            e.preventDefault();
        }else {
            e.returnValue = false;
        }
        $scope.UpdateRecord();
    });

    $scope.UpdateRecord = function () {

        var UpdatedRecordDetails = {
            ParentId: $scope.Record.ParentId,
            Paid: $scope.Record.Paid,
            Type: $scope.Record.Type,
            IsComplete: $scope.Record.IsComplete,
            Requester: $scope.Record.Requester,
            WorkOrderNo: $scope.Record.WorkOrderNo,
            ServicePlanExp: $scope.Record.ServicePlanExp,
            ServicePlan: $scope.Record.ServicePlan,
            Problem: $scope.Record.Problem,
            PO: $scope.Record.PO,
            PaymentType: $scope.Record.PaymentType,
            ClaimNo: $scope.Record.ClaimNo,
            Backup: $scope.Record.Backup,
            BackupText: $scope.Record.BackupText,
            CompleteInfo: $scope.Record.CompleteInfo,
            Contact: $scope.Record.Contact,
            Assets: $scope.Record.Assets,
            Parts: $scope.Record.Parts,
            TechNotes: $scope.Record.TechNotes,
            _id: $scope.Record._id
        }

        RecordService.UpdateRecord(UpdatedRecordDetails, function (updatedRec) {
            $scope.Record = updatedRec;
            alert("Record updated successfully!");
        });

        $scope.RecordForm.$setPristine();
    }

    $scope.DiscardUpdate = function () {
        Globals.SetRecordId($scope.Record._id);
        $rootScope.$broadcast('ShowRecord');
        $scope.RecordForm.$setPristine();
    }
    //show parts modal
    $scope.AddPart = function () {
        $rootScope.$broadcast("ShowPartPicker", null);
        $scope.RecordForm.$setDirty();
        //PartService.SetModelNo($scope.Record.Assets[0].ModelNo);    
    }
    //after part modal closes, this fires and pushes part into parts array
    $scope.$on("PartAdded", function (event, part) {
        $scope.Record.Parts.push(part);
        $scope.RecordForm.$setDirty();
    });
    //if part was updated, then set form dirty so update button is enabled
    $scope.$on("PartUpdated", function (event, part) {
        $scope.RecordForm.$setDirty();
    });
    //if modal closes and nothing was changed, discard the changes on our record scope
    $scope.$on("PartNotUpdated", function (event) {
        $scope.DiscardUpdate();
    });
    //remove a part from parts array
    $scope.RemovePart = function (part) {
        $scope.Record.Parts = _.without($scope.Record.Parts, part);
        $scope.RecordForm.$setDirty();
    }
    //edit part, open parts modal, pass in part
    $scope.EditPart = function (part) {
        $rootScope.$broadcast("ShowPartPicker", part);
    }
    //mike wrote this, opens that tracking modal and sets the title
    $scope.GetTrackingNo = function (part) {

        var callback = function (retval) {
            part.ShippingInfo.TrackingNo = retval;
        };
        $rootScope.$broadcast("ShowInputValue", "Tracking # Input", "Please scan barcode now", part.ShippingInfo.TrackingNo, callback);
    }
    //user clicks on parts status icon, it recieves it, changes icon
    $scope.PartReceived = function (index) {
        $scope.Record.Parts[index].Received = true;
        $scope.RecordForm.$setDirty();
    }
    //initialize asset object, push this object into assets array
    $scope.AddAsset = function () {
        $scope.Record.Assets.push({
            Brand: "0",
            ModelNo: "",
            ModelName: "",
            SerialNo: "",
            AssetTag: ""
        });
    }
    //remove asset and set form to dirty
    $scope.RemoveAsset = function (asset) {
        if ($scope.Record.Assets.length > 1) {
            $scope.Record.Assets = $scope.Record.Assets.splice($scope.Record.Assets.indexOf(asset), 1);
            $scope.RecordForm.$setDirty();
        } else {
            $scope.Record.Assets = [];
            $scope.RecordForm.$setDirty();
        }
    }
    //from automodelno directive, when autocomplete item is selected, we set the model info to model that was selected
    $scope.$on('SetRecordModel', function (event, index, selectedModel) {
        $scope.Record.Assets[index].Brand = selectedModel.Brand; 
        $scope.Record.Assets[index].ModelName = selectedModel.ModelName;   
        $scope.Record.Assets[index].ModelNo = selectedModel.ModelNo;
    });
    //from autoserialno directive, we set the entire asset object 
    $scope.$on('SetSerialInfo', function (event, assetObj) {
        var index = assetObj.Index;
        $scope.Record.Assets[index].SerialNo = assetObj.SerialNo;
        $scope.Record.Assets[index].AssetTag = assetObj.TagNo;   
        $scope.Record.Assets[index].ModelNo = assetObj.ModelNo;
        $scope.Record.Assets[index].ModelName = assetObj.ModelName;
        $scope.Record.Assets[index].Brand = assetObj.Brand;
    });

    //open contacts modal
    $scope.FindContact = function () {
        $rootScope.$broadcast("ShowContactPicker", "Record");
    }

    //open notes modal
    $scope.ShowNotesModal = function () {
        $rootScope.$broadcast('ShowAllNotesModal', $scope.Record.TechNotes);
    }
    //boolean to see if we should show more notes button
    $scope.ShouldWeShowNotesButton = function (record) {
        $scope.ShowMoreNotes = record.TechNotes.length > 3;
    }
    //on click of add note, open notes modal
    $scope.AddNote = function () {
        $rootScope.$broadcast('ShowNoteModal');
    }
    //after new note added, modal is closed and this fires pushing in new note to array
    $scope.$on('NoteAdded', function (event, note) {
        $scope.Record.TechNotes.push({
            Date: new Date().toLocaleString(),
            DateModified: "",
            Tech: "",
            Note: note
        });
        $scope.RecordForm.$setDirty();
        $scope.ShouldWeShowNotesButton($scope.Record);
    });
    
    //edit existing note, open notes modal and pass in note from array of notes
    $scope.EditNote = function (note, index) {
        CurrentNoteIndex = $scope.Record.TechNotes.length - 1 - index;
        $rootScope.$broadcast('EditNote', note);
    }
    //after modal closes, this fires and we update the note on our view
    $scope.$on('NoteEdited', function (event, note) {
        $scope.Record.TechNotes[CurrentNoteIndex].Note = note;
        $scope.Record.TechNotes[CurrentNoteIndex].DateModified = new Date().toLocaleString();
        $scope.RecordForm.$setDirty();
        $scope.ShouldWeShowNotesButton($scope.Record);
    });
    //if service plan is 'out of warranty', then we force the payment type to collect money
    $scope.OutOfWarranty = function () {
        if($scope.Record.ServicePlan == "0") {
            $scope.Record.PaymentType = "Collect Money";
        }
    }
    //open complete modal
    $scope.YouCompleteMe = function () {
        $rootScope.$broadcast("ShowCompleteMe", $scope.Record.PaymentType);
        console.log($scope.Record.PaymentType);
    }
    //when complete modal closes, this fires and sends an email and updates the record with complete status info
    $scope.$on("CompleteRecord", function (event, completeInfo, paymentType) {
        $scope.Record.CompleteInfo = completeInfo;
        $scope.Record.PaymentType = paymentType;
        $scope.Record.IsComplete = true;
        $scope.Record.Paid = true;
        $scope.RecordForm.$setDirty();
        RecordService.SendCompleteEmail($scope.Record, function (retval) {
            console.log(retval);
        });
    });
    
    $scope.UnCompleteMe = function () {
        $rootScope.$broadcast('UnCompleteMe');
        $scope.Record.IsComplete = false;
        $scope.Record.CompleteInfo.ActionNotes = "";
        $scope.RecordForm.$setDirty();
    }

    $scope.$watch(function () {
        if ($scope.Record == undefined) { return; }

        // parts
        var partsTotal = 0;
        var laborTotal = 0;
        var shippingTotal = 0;
        var subTotal = 0;
        if ($scope.Record.Parts && $scope.Record.Parts.length > 0) {
            $.each($scope.Record.Parts, function (i, obj) {

                if (obj.Type === "labor") {
                    if (!isNaN(parseFloat(obj.Price))) {
                        laborTotal = laborTotal + parseFloat(obj.Price);
                    }
                }else {
                    if (!isNaN(parseFloat(obj.ShippingCost)) && !isNaN(parseFloat(obj.Price))) {
                        shippingTotal = shippingTotal + parseFloat(obj.ShippingCost);
                        partsTotal = partsTotal + parseFloat(obj.Price);
                    }else if(!isNaN(parseFloat(obj.Price))) {
                        partsTotal = partsTotal + parseFloat(obj.Price);
                    }else if(!isNaN(parseFloat(obj.ShippingCost))) {
                        shippingTotal = shippingTotal + parseFloat(obj.ShippingCost);
                    }
                 }

            });
        }
        subTotal = partsTotal + laborTotal + shippingTotal;
        var totals = {
            Parts: partsTotal.toFixed(2),
            Labor: laborTotal.toFixed(2),
            Shipping: shippingTotal.toFixed(2),
            SubTotal: subTotal.toFixed(2),
            Tax: 0.00,
            Total: 0.00
        };

        totals.SubTotal = (parseFloat(totals.Parts) +  parseFloat(totals.Labor) + parseFloat(totals.Shipping)).toFixed(2);
        totals.Tax = parseFloat(subTotal * taxRate).toFixed(2);
        totals.Total = parseFloat(subTotal + parseFloat(totals.Tax)).toFixed(2);

        $scope.Totals = totals;

    });

    //TAB MANAGEMENT
    $scope.TabManager = {};
    $scope.TabManager.TabItems = [];
    //Initialize 2 tabs when the controller loads
    $scope.TabManager.InitTabs = function (id) {
        //If id was passed, we set the 1st tab to that Record._id, this is when we are defaulting the page to a certain Record #. 
        if(id) {
            $scope.TabManager.TabItems.push({title: "Rec #: " + id});
            $scope.TabManager.TabItems.push({title: "New Tab"});
            //If no id passed, we open a new tab for a new record
        }else {
            $scope.TabManager.TabItems.push({title: "Open Tab"});
            $scope.TabManager.TabItems.push({title: "New Tab"});
        }   
    }

    //When we are on the record page and user clicks on "New Tab", we put "New Tab" at end of tabs array and make that clicked tab a new open tab. 
    $scope.TabManager.AddNewTab = function (index) {
        $scope.TabManager.TabItems.push({title: "New Tab", CloseButton: false});
        $scope.TabManager.TabItems[index].title = "Open Tab";
        $scope.TabManager.TabItems[index].CloseButton = true;
        $rootScope.$broadcast('SetNavSearch', "");
    }
    //Create a child record and copy the entire parent except for parts. 
    $scope.$on('NewRelatedRec', function (event, parentId) {
        UpdateCurrentRecord(); //Save the current parent record in our virtual array of records on our service. 
        var parentRecObj = {};
        $scope.TabManager.TabItems.forEach(function (tab, index) {
            if(tab.title == "New Tab") {
                SetRecordIndex(index); //We get the index of last tab in our array, this will be the new open tab to create 
            }else if(tab.title == "Rec #: " + parentId) {
                parentRecObj = RecordService.GetRecordsArray()[index]; //we copy our parent record object
            }
        });
        $scope.TabManager.AddNewTab(CurrentRecordIndex); //add new open tab 
        $scope.$broadcast('MakeLastTabActive'); //make this new open tab active
        $scope.SearchMode = false;
        $scope.ShowSection = 4;
        $scope.Record = parentRecObj; // set our new child Record to be same as parent
        $scope.Record.ParentId = parentId; //set our ParentId
        $scope.Record.Parts = []; // set parts to be empty, this is why they create childrent in the first place, to add parts and make a new order # 

        RecordService.AddToRecordsArray(CurrentRecordIndex, $scope.Record, $scope.ShowSection, $scope.SearchMode, $scope.RecordForm.$pristine);
        console.log($scope.Record);
    });

    //function to set the tab title
    $scope.TabManager.UpdateTabRecNo = function (index, recId) {
        $scope.TabManager.TabItems[index].title = "Rec #: " + recId;
    }
    //On close of tab, we splice it off our tabs array and splice it off our virtual records array in our service
    $scope.$on('CloseTab', function (event, index) {
        $scope.TabManager.TabItems.splice(index, 1);
        RecordService.CloseTab(index);
    });
   
    $scope.$on('AddTab', function (event, index) {
        $scope.TabManager.AddNewTab(index);
    });
    //we update our current record scope whenever we change tabs
    var UpdateCurrentRecord = function () {
        RecordService.UpdateCurrentRecord(CurrentRecordIndex, $scope.Record, $scope.ShowSection, $scope.SearchMode, $scope.RecordForm.$pristine); 
    }
    //This is called from our Tabs directive when we change tabs
    $scope.$on('SaveCurrentRecord', function (event) {
        UpdateCurrentRecord();
    });
    //The select tag with ng-options only takes objects, so I had to make the record numbers into objects.
    var ChildrenRecs = function (children) {
        var childrenObjs = children.map(function (child) {
            return {Id: child};
        });
        $scope.Record.Children = childrenObjs;
    }
    //when user clicks on ParentId link at bottom of page, we change scope to parents record
    $scope.GoToParentRec = function () {
        Globals.SetRecordId($scope.Record.ParentId);
        $scope.$broadcast('ShowRecord');
        $rootScope.$broadcast('SetNavSearch', $scope.Record.ParentId); 
    }
    //when they select a child id from select tag, we jump to that child record scope
    $scope.GoToChildRec = function () {
        Globals.SetRecordId($scope.Child.Id);
        $scope.$broadcast('ShowRecord');
        $rootScope.$broadcast('SetNavSearch', $scope.Child.Id);
    }
    //we call this from Tabs directive, we show first tab on close of another tab, or show the scope of selected tab
    $scope.$on('ShowSelectedRecord', function (event, index) {
        var recArr = RecordService.GetRecordsArray();
        $scope.Record = recArr[index];
        if($scope.Record._id) { 
            $rootScope.$broadcast('SetNavSearch', $scope.Record._id);
            $rootScope.$broadcast('EnableNavButtons');
        }else {
            $rootScope.$broadcast('SetNavSearch', "");
            $rootScope.$broadcast('DisableNavButtons');
        }
        SetRecordIndex(index);        
        $scope.ShowSection = RecordService.GetSettingsArray()[index].ShowSection;
        $scope.SearchMode = RecordService.GetSettingsArray()[index].SearchMode;
        RecordService.GetSettingsArray()[index].Pristine ? $scope.RecordForm.$setPristine() : $scope.RecordForm.$setDirty();
        ChildrenRecs($scope.Record.Children);
    });
    //Initialize new record scope, when new tab was clicked, we pass the index to know which index to open new tab on 
    $scope.$on('NewRecord', function (event, index) {
        if(index == null) {
            index = CurrentRecordIndex;
            $scope.TabManager.TabItems[index].title = "Open Tab";
        }
        $scope.ShowSection = 1;
        $scope.SearchMode = false;
        $scope.ShowMoreNotes = false;
        $rootScope.$broadcast('ClearNavSearch');
        console.log(Globals.GetRecordId());
        $rootScope.$broadcast('DisableNavButtons');
        $scope.Record = RecordService.NewRecord();
        $scope.RecordForm.$setPristine();
        RecordService.AddToRecordsArray(index, $scope.Record, $scope.ShowSection, $scope.SearchMode, $scope.RecordForm.$pristine);
        SetRecordIndex(index); 
    });
    //when navigation search is fired, we pull the record # from Globals which was set from TopNav ctrl. 
    //then we make a DB call to get that record
    $scope.$on('ShowRecord', function (event) {
        var CurrentRecordId = Globals.GetRecordId();
        if(CurrentRecordId == 0) { return; }
        $scope.ShowSection = 4;
        $scope.SearchMode = true;
        RecordService.GetRecordById(CurrentRecordId, function (record) {
            $scope.Record = record;
            $scope.ShouldWeShowNotesButton(record);
            $scope.TabManager.UpdateTabRecNo(CurrentRecordIndex, record._id);
            UpdateCurrentRecord();
            ChildrenRecs($scope.Record.Children);
        });
    });
    //when they click on the next record right arrow navigation button
    $scope.$on('NextRecord', function (event, currentRecordId) {
        RecordService.GetRecordById((currentRecordId +1), function (newRecord) {
            $scope.Record = newRecord;
            $scope.ShouldWeShowNotesButton(newRecord);
            $scope.SearchMode = true;
            $scope.RecordForm.$setPristine();
            $scope.ShowSection = 4;
            $scope.TabManager.UpdateTabRecNo(CurrentRecordIndex, newRecord._id);
            UpdateCurrentRecord();
            ChildrenRecs($scope.Record.Children);
        });
    });
    //when they click on the prev record left arrow navigation button
    $scope.$on('PrevRecord', function (event, currentRecordId) {
        RecordService.GetRecordById((currentRecordId -1), function (newRecord) {
            $scope.Record = newRecord;
            $scope.ShouldWeShowNotesButton(newRecord);
            $scope.SearchMode = true;
            $scope.RecordForm.$setPristine();
            $scope.ShowSection = 4;
            $scope.TabManager.UpdateTabRecNo(CurrentRecordIndex, newRecord._id);
            UpdateCurrentRecord();
            ChildrenRecs($scope.Record.Children);
        });
    });

    //when contact is selected from dashboard, we set Record.Contact with that object and set the Record.Type to the Contact.Type
    $scope.$on('ContactSelected', function (event, contact) {

        $scope.Record.Contact = contact;
        $scope.Record.Type = contact.Type;
        $scope.RecordForm.$setDirty();
        $rootScope.$broadcast('DisableNavButtons');

        // When the contact is selected form Dashboard or Record, we check the contact Type to see if it has a District Type on. 
        // If it does, we simply set the Record.Type to that District. 
        // If its not, we check to see if Contact.Company is a District FullName by making a DB call. 
        // If we found a match to District FullName from Contact.Company, then we update the Contact.Type to be 
        // District.Name and we go back to the Record and set the Type as well. 
        // If we dont find a match, its possible that that is a school and it still belongs to some District, 
        // how am I going to make sure that contact now has a Type of its proper District??

    });
    //INIT....
    var LoadRecordId = Globals.GetRecordId();
    console.log(LoadRecordId);

    if(LoadRecordId != null) {
        if(LoadRecordId == 0) {
            $scope.Record = RecordService.NewRecord();
            $scope.TabManager.InitTabs();
            $scope.SearchMode = false;
            $scope.ShowSection = 1;
            SetRecordIndex(0);
        }else {
            RecordService.GetRecordById(LoadRecordId, function (record) {
                $scope.Record = record;
                $scope.TabManager.InitTabs(record._id);
                $scope.ShowSection = 4;
                RecordService.AddToRecordsArray(0, record);
                SetRecordIndex(0);
                $scope.ShouldWeShowNotesButton(record);
                ChildrenRecs($scope.Record.Children);
            });
        }
    }else {
        RecordService.GetRecordById(33, function (record) {
            $scope.Record = record; 
            $scope.TabManager.InitTabs(33);
            $scope.ShowSection = 4;
            RecordService.AddToRecordsArray(0, record);
            SetRecordIndex(0);
            $rootScope.$broadcast('SetNavSearch', 33);
            $scope.ShouldWeShowNotesButton(record);
            ChildrenRecs($scope.Record.Children);
        });
    }



    


}]);