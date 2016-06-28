'use strict';

/**
 * @ngdoc function
 * @name tipntripVpApp.controller:AddtripCtrl
 * @description
 * # AddtripCtrl
 * Controller of the tipntripVpApp
 */
angular.module('tipntripVpApp')
  .controller('AddtripCtrl', function ($scope,Auth,$firebaseArray,$state) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    $scope.newTrip = {
    	title: "",
    	countries: "" 
    };
    console.log(Auth.$getAuth().uid);
    $scope.uid = Auth.$getAuth().uid;
    $scope.ref = new Firebase("https://vitrualplanner.firebaseio.com/" + $scope.uid + "/trips");
    console.log("firebase file");
    console.log($scope.ref);

    $scope.addTrip = function(trip){
    	$state.go("acount");
    	var tripsList =  $scope.ref.push();
    	tripsList.set({
    		title: $scope.newTrip.title,
    		countries: $scope.newTrip.countries,
            traveler: {
                uid: "",
                email: ""
            },
            advisor: {
                uid : $scope.uid,
                email : Auth.$getAuth().auth.token.email
            }
    	},
    	function(error){
    		if(error){
    			console.log(error);
    		}
    		else{

    			console.log("Trip saved");
    		}
    	});
    };
  });
