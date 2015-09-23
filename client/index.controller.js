'use strict';

angular.module('feedScopeApp')
  .controller('IndexCtrl', function($scope, Global, Auth) {
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.pageTitle = Global.pageTitle;
  });
