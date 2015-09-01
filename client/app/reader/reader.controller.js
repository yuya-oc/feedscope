'use strict';

angular.module('feedScopeApp')
  .controller('ReaderCtrl', function($scope, $http, Article, Feed) {
    $scope.addFeed = function(feedName, feedUrl) {
      Feed.save({}, {
          name: feedName,
          url: feedUrl
        },
        function(feed) {
          $scope.feeds = Feed.query();
        },
        function(err) {
          console.log(err);
        }).$promise;
    };

    $scope.feeds = Feed.query();
    $scope.articles = Article.query();

    $scope.selectFeed = function(feed) {
      $scope.selectedFeed = feed;
    };
  });
