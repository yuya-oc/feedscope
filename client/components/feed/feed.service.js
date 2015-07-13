'use strict';

angular.module('feedScopeApp')
  .factory('Feed', function($resource) {
    return $resource('/api/feeds/:id', {
      id: '@id'
    }, {
      /*      query: {
              method: 'GET',
              isArray: true
            },*/
      subscribe: {
        method: 'POST',
      }
    });
  });
