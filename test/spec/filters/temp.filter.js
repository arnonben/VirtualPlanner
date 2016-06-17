'use strict';

describe('Filter: temp.filter', function () {

  // load the filter's module
  beforeEach(module('tipntripVpApp'));

  // initialize a new instance of the filter before each test
  var temp.filter;
  beforeEach(inject(function ($filter) {
    temp.filter = $filter('temp.filter');
  }));

  it('should return the input prefixed with "temp.filter filter:"', function () {
    var text = 'angularjs';
    expect(temp.filter(text)).toBe('temp.filter filter: ' + text);
  });

});
