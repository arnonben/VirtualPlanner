'use strict';

describe('Service: transportations', function () {

  // load the service's module
  beforeEach(module('tipntripVpApp'));

  // instantiate service
  var transportations;
  beforeEach(inject(function (_transportations_) {
    transportations = _transportations_;
  }));

  it('should do something', function () {
    expect(!!transportations).toBe(true);
  });

});
