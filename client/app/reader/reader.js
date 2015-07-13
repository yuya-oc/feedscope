'use strict';

angular.module('feedScopeApp')
  .config(function($routeProvider) {
    $routeProvider
      .when('/reader', {
        templateUrl: 'app/reader/reader.html',
        controller: 'ReaderCtrl'
      });
  });
