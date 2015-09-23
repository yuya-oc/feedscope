'use strict';

angular.module('feedScopeApp')
  .controller('IndexCtrl', function($scope, Global, Auth) {
    $scope.global = Global;
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.selectFeed = function(feed) {
      Global.selectedFeed = feed;
    };
  });
