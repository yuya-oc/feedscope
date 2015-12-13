'use strict';

angular.module('feedScopeApp')
  .controller('AdminCtrl', function($scope, $http, Auth, User, $mdDialog) {

    // Use the User $resource to fetch all users
    $scope.users = User.query();

    $scope.delete = function(event, user) {
      var procc = function(answer) {
        console.log(answer);
        User.remove({
          id: user._id
        });
        angular.forEach($scope.users, function(u, i) {
          if (u === user) {
            $scope.users.splice(i, 1);
          }
        });
      };
      var confirm = $mdDialog.confirm()
        .title('Would you like to delete ' + user.name + ' ?')
        .targetEvent(event)
        .ok('OK')
        .cancel('Cancel');
      $mdDialog.show(confirm).then(procc, function() {});
    };
  });
