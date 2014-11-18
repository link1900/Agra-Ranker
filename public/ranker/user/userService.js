angular.module('services').service('userService',  function($http,$resource) {
    var userService = $resource(
        'user/:userId',
        {
            userId:'@_id'
        },{
            update: {
                method: 'PUT'
            }
        }
    );

    userService.grantAccess = function(user){
        return $http.post("/user/grantAccess/"+ user._id).then(function(result){
            return result.data;
        });
    };

    userService.signUp = function(user) {
        return $http.post("/user/requestAccess", user).then(function(result){
            return result.data;
        });
    };

    return userService;
});