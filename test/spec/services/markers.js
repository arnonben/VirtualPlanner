'use strict';

describe('Service: markers', function () {

  // load the service's module
  beforeEach(module('tipntripVpApp'));

  // instantiate service
  var markers;
  beforeEach(inject(function (_markers_) {
    markers = _markers_;
  }));

  it('should do something', function () {
    expect(true).toBe(true);
  });

});
