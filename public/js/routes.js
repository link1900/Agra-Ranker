angular.module('core').config(function($routeProvider) {
    $routeProvider.when('/', {
        templateUrl : '/views/rankings.html'
        })
        .when('/greyhound/edit/:id', {
            templateUrl : '/views/greyhoundEditForm.html'
        })
        .when('/greyhound/view/:id', {
            templateUrl : '/views/greyhoundView.html'
        })
        .when('/greyhound/create', {
            templateUrl : '/views/greyhoundCreateForm.html'
        })
        .when('/greyhound', {
            templateUrl : '/views/greyhound.html'
        })
        .when('/greyhound/import', {
            templateUrl : '/views/greyhoundUpload.html'
        })
        .when('/batch', {
            templateUrl : '/views/batchList.html'
        })
        .when('/batch/view/:id', {
            templateUrl : '/views/batchView.html'
        })
        .when('/login', {
            templateUrl : '/views/login.html'
        })
        .when('/signup', {
            templateUrl : '/views/signup.html'
        })
        .when('/race', {
            templateUrl : '/views/race.html'
        })
        .when('/rankingSystem', {
            templateUrl : '/views/rankingSystem.html'
        })
        .when('/groupLevel/create', {
            templateUrl : '/views/groupLevelCreate.html'
        })
        .when('/groupLevel/edit/:id', {
            templateUrl : '/views/groupLevelEdit.html'
        })
        .when('/groupLevel/view/:id', {
            templateUrl : '/views/groupLevelView.html'
        })
        .when('/groupLevel', {
            templateUrl : '/views/groupLevel.html'
        })
        .when('/import', {
            templateUrl : '/views/import.html'
        })
        .otherwise({
            redirectTo : '/'
        });
});