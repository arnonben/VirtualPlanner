'use strict';

describe('Directive: ngAutocomplete', function () {

  // load the directive's module
  beforeEach(module('tipntripVpApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<ng-autocomplete></ng-autocomplete>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the ngAutocomplete directive');
  }));
});
