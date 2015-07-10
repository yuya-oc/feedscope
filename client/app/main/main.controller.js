'use strict';

angular.module('feedScopeApp')
  .controller('MainCtrl', function ($scope, $http, Feed) {
    $scope.awesomeThings = [];

    $http.get('/api/things').success(function(awesomeThings) {
      $scope.awesomeThings = awesomeThings;
    });

    $scope.addThing = function() {
      if($scope.newThing === '') {
        return;
      }
      $http.post('/api/things', { name: $scope.newThing });
      $scope.newThing = '';
    };

    $scope.deleteThing = function(thing) {
      $http.delete('/api/things/' + thing._id);
    };

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
