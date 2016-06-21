'use strict';

describe('Controller: AuthctrlCtrl', function () {

  // load the controller's module
  beforeEach(module('tipntripVpApp'));

  var AuthctrlCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AuthctrlCtrl = $controller('AuthctrlCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
