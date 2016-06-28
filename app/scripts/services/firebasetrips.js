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

        var isEqual = function(tripa,tripb){
          console.log("isEqual")
          console.log(tripa)
          console.log(tripb)
          console.log()
          return tripa.key === tripb.key
        }
        var isContains =  function(trips,trip){
          for (var i = 0; i < trips.length; i++) {
            if(isEqual(trips[i],trip)){
              return true
            }
          }
          return false
        }
        console.log(Auth.$getAuth().auth.uid)
        var uid = Auth.$getAuth().auth.uid
        var add = FirebaseUrl + uid + "/trips"
        var ref = new Firebase(FirebaseUrl + "/" + uid + "/trips");
        var trips = []
        ref.on("value",function(snapshot){
          snapshot.forEach(function(childSnapshot) {
            var trip = childSnapshot.val()
            trip.key = childSnapshot.key()
            trip.dup = {}
            trip.dup.title = trip.title
            trip.dup.countries = trip.countries
            if (!isContains(trips,trip)){
              trips.push(trip)
            }
          })
        })
        $scope.$watch('trips',function(){
          console.log("trips changed")
        })        
        return trips
      }
    };
  });
