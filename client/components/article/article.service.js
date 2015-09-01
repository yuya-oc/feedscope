'use strict';

angular.module('feedScopeApp')
  .factory('Article', function($resource) {
    return $resource('/api/articles/:id', {
      id: '@id'
    }, {
      /*      query: {
              method: 'GET',
              isArray: true
            },*/
      //      subscribe: {
      //        method: 'POST',
      //      }
    });
  });
