'use strict';

/**
 * @ngdoc function
 * @name tipntripVpApp.controller:AccountCtrl
 * @description
 * # AccountCtrl
 * Controller of the tipntripVpApp
 */
angular.module('tipntripVpApp')
  .controller('AccountCtrl', function ($scope,$state,Auth,firebaseTrips) {
  	$scope.trips = firebaseTrips.getTrips($scope)

    $scope.$watch('trips',function(){
      console.log("trips created")
    })
  	$scope.removeTrip = function(trip){
  		console.log("remove trip")
  	}

  	$scope.dupTrip = function(trip){
  		console.log("duplicate trip")
  	}

  	$scope.goToVp = function(trip){
      console.log(Auth.$getAuth().auth.uid)
  		$state.go('vp',{uid:Auth.$getAuth().auth.uid,tripid:trip.key})
  	}

  	$scope.shareTrip = function(trip){
  		console.log("share trip")
  	}
  });
