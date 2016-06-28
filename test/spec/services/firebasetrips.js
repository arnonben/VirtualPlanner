'use strict';

describe('Service: firebaseTrips', function () {

  // load the service's module
  beforeEach(module('tipntripVpApp'));

  // instantiate service
  var firebaseTrips;
  beforeEach(inject(function (_firebaseTrips_) {
    firebaseTrips = _firebaseTrips_;
  }));

  it('should do something', function () {
    expect(true).toBe(true);
  });

});
