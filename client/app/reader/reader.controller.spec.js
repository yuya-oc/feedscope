'use strict';

describe('Controller: ReaderCtrl', function() {

  // load the controller's module
  beforeEach(module('feedScopeApp'));

  var ReaderCtrl,
    scope,
    $httpBackend;

  // Initialize the controller and a mock scope
  beforeEach(inject(function(_$httpBackend_, $controller, $rootScope) {
    $httpBackend = _$httpBackend_;
    $httpBackend.expectGET('/api/feeds')
      .respond([{
        name: 'MongoDB'
      }, {
        name: 'Express'
      }, {
        name: 'AngularJS'
      }, {
        name: 'Node.js'
      }]);
    $httpBackend.expectGET('/api/articles')
      .respond([]);

    scope = $rootScope.$new();
    ReaderCtrl = $controller('ReaderCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of things to the scope', function() {
    $httpBackend.flush();
    expect(scope.feeds.length).toBe(4);
  });
});
