'use strict';

describe('Directive: imageOnLoadDirective', function () {

  // load the directive's module
  beforeEach(module('tipntripVpApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<image-on-load-directive></image-on-load-directive>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the imageOnLoadDirective directive');
  }));
});
