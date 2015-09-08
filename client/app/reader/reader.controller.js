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
      var read_article = {
        _id: article._id,
        read: true
      };
      Article.update({}, read_article,
        function(a) {
          article.read = true;
        },
        function(err) {
          console.log(err);
        });
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

    $scope.countNonReadArticles = function(feed) {
      var nonread = $scope.articles
        .filter(function(article) {
          return (article.sourceFeed == feed._id);
        })
        .filter(function(article) {
          return (article.read == false);
        });
      return nonread.length;
    }

    $scope.summarize = function(article) {
      if (article.summary) return article.summary;
      return article.description;
    }
  });
