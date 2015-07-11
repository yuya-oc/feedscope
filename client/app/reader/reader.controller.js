'use strict';

angular.module('feedScopeApp')
  .controller('ReaderCtrl', function ($scope, $http, Feed) {
    $scope.addFeed = function(feedName, feedUrl){
      Feed.save({},
        {
          name: feedName,
          url: feedUrl
        },
        function(feed){
          $scope.feeds = Feed.query();
        },
        function(err){
          console.log(err);
        }).$promise;
    };

    $scope.feeds = Feed.query();
  });
