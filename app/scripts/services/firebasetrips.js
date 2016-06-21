'use strict';

/**
 * @ngdoc service
 * @name tipntripVpApp.firebaseTrips
 * @description
 * # firebaseTrips
 * Factory in the tipntripVpApp.
 */
angular.module('tipntripVpApp')
  .factory('firebaseTrips', function (Auth,FirebaseUrl) {
    // Service logic
    // ...

    // Public API here
    return {
      getTrips: function ($scope) {
        console.log(Auth.$getAuth().auth.uid)
        var uid = Auth.$getAuth().auth.uid
        var add = FirebaseUrl + uid + "/trips"
        var ref = new Firebase(FirebaseUrl + "/" + uid + "/trips");
        var trips = []
        ref.on("value",function(snapshot){
          snapshot.forEach(function(childSnapshot) {
            var trip = childSnapshot.val()
            trip.key = childSnapshot.key()
            trips.push(trip)
            console.log("Trip")
            console.log(trip)
            $scope.$apply()
          })
        })
        return trips
      }
    };
  });
