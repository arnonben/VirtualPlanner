'use strict';

/**
 * @ngdoc function
 * @name tipntripVpApp.controller:AccountCtrl
 * @description
 * # AccountCtrl
 * Controller of the tipntripVpApp
 */
angular.module('tipntripVpApp')
  .controller('AccountCtrl', function ($scope,$state,Auth,$firebaseObject) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    $scope.uid = Auth.$getAuth().auth.uid;
    $scope.email = Auth.$getAuth().auth.token.email;
    $scope.ref = new Firebase("https://vitrualplanner.firebaseio.com/" + $scope.uid + "/trips");

    var syncObject = $firebaseObject($scope.ref);

    syncObject.$bindTo($scope, "trips").then(function(){
      console.log("trps");
    });
    // })

    $scope.sharedRef = new Firebase("https://vitrualplanner.firebaseio.com/" + $scope.uid + "/sharedTrips");
    var syncObject2 = $firebaseObject($scope.sharedRef);

    $scope.sharedTrips = [];
    $scope.sharedRefs = [];
    var index = 0;

    syncObject2.$bindTo($scope, "shareTripsMeta");

    $scope.usersRef = new Firebase("https://vitrualplanner.firebaseio.com/users/");

  	$scope.dupTrip = function(trip){
      console.log("Duplicate")
      trip.dupTrip = false;
      console.log(trip.dupTrip)
      var dupTrip = {
        countries : trip.dup.countries,
        title : trip.dup.title,
        toggle : true
      };
      console.log(dupTrip);
      //Deep copy of the metadata of the trips
      $scope.trip = trip;
      var tripsList =  $scope.ref.push();
      tripsList.set({
        countries : dupTrip.countries,
        title : dupTrip.title,
        toggle : true,
        traveler : {
          uid: "",
          email: ""
        },
        advisor: {
          uid : $scope.uid,
          email : $scope.email
        }
      },
      function(error){
        if(error){
          console.log(error);
        }
        else{
          var setCallback =function(error){
            if(error){
              console.log(error);
            }
            else{
              console.log("Marker was duplicated");
            }
          }
          console.log("Duplicate trip");
          var path = tripsList +"/markers/";
          console.log(path);
          $scope.ref2 = new Firebase(path);
          for (var marker in $scope.trip.markers) {
            var newMarker = $scope.trip.markers[marker];
            var MarkerList = $scope.ref2.push();
            MarkerList.set(newMarker,setCallback(error));
          }
        }
      });
  	};

  	$scope.goToVp = function(tripId,trip){
      console.log(tripId);
  		$state.go('vp',{advisorUid:trip.advisor.uid,advisorEmail:trip.advisor.email,travUid:trip.traveler.uid,travEmail:trip.traveler.email,tripId:tripId});
  	};

    $scope.goToSharedVp = function(tripId,trip){
      $state.go('vp',{advisorUid:trip.advisorUid,advisorEmail:trip.advisorMail,travUid:trip.travelerUid,travEmail:trip.travelerMail,tripId:tripId})      ;
    };

  	$scope.shareTrip = function(trip,tripId,email){
      var tmp = 0;
      $scope.usersRef.orderByChild("email").equalTo(email).on("value", function(snapshot) {
        /* jshint ignore:start */
        for (var i in snapshot.val()){
          console.log(snapshot.val()[i]);
          var uid = snapshot.val()[i].uid;
          var title = trip.title;
          var sharedUserRef = new Firebase("https://vitrualplanner.firebaseio.com/" + uid + "/sharedTrips");
          var sharedTrip =  sharedUserRef.push();
          sharedTrip.set({
            advisorUid : $scope.uid,
            advisorMail: $scope.email,
            travelerUid: uid,
            travelerMail: email,
            tripId : tripId,
            title : title
          },
          function(error){
            if (error) {
                console.log(error);
              }
              else{
                var originTripRef = new Firebase("https://vitrualplanner.firebaseio.com/" + $scope.uid + "/trips/" + tripId);
                originTripRef.update({traveler:{uid:uid,email:email}});
                console.log("Trip was shared with " +  email);

              }
          });
        }
        /* jshint ignore:end */
      },function(error){
        console.log(error);
      });

  	};

    $scope.deleteTrip = function(tripId,trip){
      var traveler = trip.traveler.uid;
      console.log(tripId)
      if (traveler != ""){
        var travelerRef = new Firebase("https://vitrualplanner.firebaseio.com/" + traveler + "/sharedTrips/"  );
        travelerRef.orderByChild("tripId").equalTo(tripId).on("value", function(snapshot) {
          $scope.tmpTripVal = snapshot.val()
          $scope.tmpTripKey = snapshot.key()
          console.log(snapshot.val());
          console.log(Object.keys(snapshot.val())[0]);
          travelerRef.child(Object.keys(snapshot.val())[0]).remove()
          //travelerRef.child(snapshot.key())
        });
      }
      $scope.ref.child(tripId).remove();
    }

  });
