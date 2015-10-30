var app = angular.module('MCS_ServiceApp', ['ngRoute', 'ngResource', 'ui.bootstrap', 'ngSanitize']);


app.config(['$routeProvider', function ($routeProvider) {


    $routeProvider.when("/dashboard", {
        templateUrl: "views/dashboard.html",
        controller: 'DashboardController',
        resolve: {Auth: NonAdmin}
    }).when("/records/:id", {
        templateUrl: "views/record.html",
        controller: 'RecordController',
        resolve: {Auth: NonAdmin}
    }).when('/records', {
        templateUrl: 'views/record.html',
        controller: 'RecordController',
        resolve: {Auth: NonAdmin}
    }).when('/parts', {
        templateUrl: 'views/parts.html',
        controller: 'PartsController',
        resolve: {Auth: NonAdmin}
    }).when('/admin', {
        templateUrl: 'views/admin/admin.html',
        controller: 'AdminController as Admin',
        resolve: {Auth: Admin}
    }).when('/admin/:type', {
        templateUrl: 'views/admin/admin.html',
        controller: 'AdminController as Admin',
        resolve: {Auth: Admin}
    }).when('/print/Record', {
        templateUrl: 'views/print.html',
        controller: 'PrintController'
    }).when('/settings', {
        templateUrl: 'views/settings.html',
        controller: 'UserController',
        resolve: {Auth: NonAdmin}
    }).when('/district-dashboard', {
        templateUrl: 'views/district-dashboard.html',
        controller: 'DistrictDashController',
        resolve: {Auth: District}
    }).otherwise({
      redirectTo: '/dashboard/',
      controller: 'DashboardController',
      resolve: {Auth: NonAdmin}
  });
    //TODO: MAYBE PULL ALL THE HTTP CALLS TO SESSOIN OUT, AND SEE IF YOU CAN DRY UP CODE AND USE
    //THE USERSERVICE METHOD!! 
    function NonAdmin ($q, $http, UserService) {
        var LoggedIn = UserService.IsLoggedIn();
        var User = UserService.GetUser();
        var checkLogin = $q.defer();
        
        //Check if they are logged in on UserService
        if(!LoggedIn) {//If not, they may have reloaded page, check if session exists
            $http.get('http://localhost:3030/getuser')
            .then(function (retval) {
                var user = retval.data;
                if(user == "" || !user.IsActive) {
                    //If session user is null or theyre not active, log them out cuz they tried hacking the url bar
                    UserService.Logout();
                    checkLogin.reject();
                }else {
                    //If they are active, log them into UserService and resolve the promise
                   checkLogin.resolve(UserService.Login(user)); 
                }
            }, function (err) {
                console.log(err);
            });
    
        }else {//If we have a User from UserService, they are good to go. On page reload, session will still be there
            checkLogin.resolve();
        }
        return checkLogin.promise;

    }

    function Admin ($q, $http, UserService, $location) {
        var LoggedIn = UserService.IsLoggedIn();
        var User = UserService.GetUser();
        var checkAdmin = $q.defer();

        //Check if they are logged in on UserService
        if(!LoggedIn) {//If not, they may have reloaded page, check if session exists
            $http.get('http://localhost:3030/getuser')
            .then(function (retval) {
                var user = retval.data;
                if(!user.IsActive || !user.IsAdmin || user == "") {
                    //If session user is null or theyre not admin, log them out cuz they tried hacking the url bar
                    UserService.Logout(); 
                    checkAdmin.reject();
                }else {
                    //If they are admin, log them into UserService and resolve the promise
                   checkAdmin.resolve(UserService.Login(user)); 
                }
            }, function (err) {
                console.log(err);
            });
    
        }else {//If they are already logged into UserService, check if Admin or not, log them out if not, cuz they are hacking the url
            User.IsAdmin ? checkAdmin.resolve() : UserService.Logout(); 
        }
        return checkAdmin.promise;
    }

    function District ($q, $http, DistrictService, $location) {
        var LoggedIn = DistrictService.IsLoggedIn();
        var checkDistrict = $q.defer();

        //Check if they are logged in on DistrictService
        if(!LoggedIn) {//If not, they may have reloaded page, check if session exists
            $http.get('http://localhost:3030/getuser')
            .then(function (retval) {
                var user = retval.data;
                if(user == "") {
                    //If session user is null or theyre not active, log them out cuz they tried hacking the url bar
                    DistrictService.Logout(); 
                    checkDistrict.reject();
                }else {
                    //If they are any type of user, log them into DistrictService and resolve the promise
                   checkDistrict.resolve(DistrictService.Login(user)); 
                }
            }, function (err) {
                console.log(err);
            });
    
        }else {
            checkDistrict.resolve(); 
        }
        return checkDistrict.promise;
    }

    

}]);

app.run(function ($rootScope, $http, UserService, $location) {//Used for 
    console.log("app.run");//Not sure what else to put here any more now that auth is being done from the routes above...

});

angular.module('MCS_ServiceApp')
.controller("MasterController", ['$rootScope', '$location', 'Globals', '$scope', function ($rootScope, $location, Globals, $scope) {

    //if location is localhost, if so, send to api/settings for dev env

    Mousetrap.bind(['ctrl+j', 'command+j'], function (e) {

        if(e.preventDefault) {
            e.preventDefault();
        }else {
            //IE
            e.returnValue = false;
        }
        $location.path('/records');
        Globals.SetRecordId(0);
        $rootScope.$broadcast("NewRecord");
        $scope.$apply();

    });
    
    // Mousetrap.bind(['ctrl+f', 'command+f'], function (e) {
    //     var field = e.srcElement.placeholder;

    //     if (e.preventDefault) {
    //         e.preventDefault();
    //     } else {
    //         // internet explorer
    //         e.returnValue = false;
    //     }
    //     $rootScope.$broadcast("ShowSearchModal", field);
    // });

}]);








