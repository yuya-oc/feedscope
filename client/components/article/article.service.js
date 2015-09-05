'use strict';

angular.module('feedScopeApp')
  .factory('Article', function($resource) {
    return $resource('/api/articles/:id', {
      id: '@_id'
    }, {
      update: {
        method: 'PUT',
      }
    });
  });
