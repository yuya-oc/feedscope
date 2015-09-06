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

    $scope.read = function(article) {
      console.log(article);
      article.read = true;
      article.$update();
    }

    $scope.readFeed = function(feed) {
      $scope.articles
        .filter(function(article) {
          return (article.sourceFeed == feed._id);
        })
        .forEach(function(article) {
          $scope.read(article);
        });
    }
  });
