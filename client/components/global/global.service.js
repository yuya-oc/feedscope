'use strict';

angular.module('feedScopeApp')
  .factory('Global', function() {
    return {
      pageTitle: 'FeedScope',
      feeds: null,
      selectedFeed: null
    };
  });
