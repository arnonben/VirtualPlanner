'use strict';
/*global google */
/**
 * @ngdoc function
 * @name tipntripVpApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the tipntripVpApp
 /images/middle-bar/add-event/event-types/event-type1.png
 */
angular.module('tipntripVpApp')
  .controller('MainCtrl', function ($scope,$document,$stateParams,$log, $timeout,$firebaseArray,$firebaseObject, $mdpDatePicker, $mdpTimePicker,NgMap,categories,markers,modes,chatService,FileUploader,Auth,transportations) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    NgMap.getMap().then(function(map) {
      $scope.map = map;
    });

    $scope.clicked = function() {
      alert('Clicked a link inside infoWindow');
    };



    $scope.showDetail = function(e, marker) {
      console.log("SHOW_DETAILS")
      console.log(e);
      $scope.marker = marker;
      $scope.map.showInfoWindow('foo-iw', "" + marker.id);
      var indexes = markers.containEventInDays(marker.markerFirebaseKey,$scope.days);
      console.log(indexes);
      $scope.modeService.setDayMode($scope,$scope.days[indexes.i]);
      $scope.modeService.setEventModeFromMap($scope,$scope.days[indexes.i].events[indexes.j],$scope.days[indexes.i]);
    };

    $scope.showDetail2 = function(marker) {
      $scope.map.showInfoWindow('foo-iw', "" + marker.id,marker);
    };

    $scope.scope = $scope;
    $scope.modeService = modes;
    $scope.markersService = markers;
    $scope.travelMode = transportations.getAll();

    $scope.types = categories.getCategories();

    //The markers array contains all the markers from the map
    $scope.markers = [];

    //The days array contains all the days of the trip.
    //Each day contains its wheather, title and the events array
    $scope.days = [];
    $scope.markerIndex = 1;

    //The eventmode daymode addeventmode define the mode of the middle screen
    modes.setEventModeSimple(true);
    modes.setDayModeSimple(false);
    modes.setAddEventModeSimple(false);
    modes.setEditEventModeSimple(false);

    //mapLocationMode define wheather we select location by the authcomplete input or by selecting
    //location on the map.
    $scope.mapLocationMode = false;

    //Timestamp of the last marker
    $scope.timeStamp = 0;
    $scope.timestampDay = -1;
    $scope.timestampEvent = {};
    $scope.timestampEventIndex = -1;
    //
    $scope.locationValid = true;

    //Add place and event

    $scope.map = {
        zoom: 3,
    center: {latitude: 40.1451, longitude: -99.6680 },
      mapTypeId: google.maps.MapTypeId.TERRAIN,
      options: {
      },
      events:{
          click: function(){
            console.log("ADD NEW MARKER");
            $scope.$apply();
          }
      },
      bounds: {}
    };

    //New event
    //TODO create a service for the firebase ref.
    // the user id and the trip firebase id
    var uid = $stateParams.advisorUid;
    var tripid = $stateParams.tripId;
    $scope.ref = new Firebase("https://vitrualplanner.firebaseio.com/" + uid + "/trips/" + tripid);
    $scope.markersRef = $firebaseArray(new Firebase("https://vitrualplanner.firebaseio.com/" + uid + "/trips/" + tripid +"/markers"));
    $scope.markersRef2 = new Firebase("https://vitrualplanner.firebaseio.com/" + uid + "/trips/" + tripid +"/markers");

    $scope.setBoundes = function(markers){
      var bounds = new google.maps.LatLngBounds();
      for (var i=0; i<markers.length; i++) {
        var latlng = new google.maps.LatLng(markers[i].coords.latitude, markers[i].coords.longitude);
        bounds.extend(latlng);
      }

      $scope.map.fitBounds(bounds);
      // for (var i=0; i<markers.length; i++){
      //   var markerBound = new google.maps.LatLng(markers[i].coords.latitude,markers[i].coords.longitude);
      //     bounds.extend(markerBound);
      //   }
      // $scope.map.bounds = {
      //     northeast: {
      //         latitude: bounds.getNorthEast().lat(),
      //         longitude: bounds.getNorthEast().lng()
      //     },
      //     southwest: {
      //         latitude: bounds.getSouthWest().lat(),
      //         longitude: bounds.getSouthWest().lng()
      //     }
      // };
    };

    $scope.daysBetween = function( date1, date2 ) {
      //Get 1 day in milliseconds
      var one_day=1000*60*60*24;

      // Convert both dates to milliseconds
      var date1_ms = date1.getTime();
      var date2_ms = date2.getTime();

      // Calculate the difference in milliseconds
      var difference_ms = date2_ms - date1_ms;

      // Convert back to days and return
      return Math.round(difference_ms/one_day);
    };

    $scope.trip = {
        title : "",
        countries: "",
        id :null
    };

    $scope.translateMarker = function(marker){
      var ans = [];
      ans.push(marker.coords.latitude);
      ans.push(marker.coords.longitude);
      return ans
    };

    $scope.translateMarkerIcon = function(marker){
      return {
        url : marker.options.icon.url,
        scaledSize:[25,45]
      };
    };

    //Init page methods
    //Firebase fetch all events and markers
    $scope.ref.on('value',function(snapshot){
      var val = snapshot.val()
      $scope.trip.title = val.title;
      $scope.trip.countries = val.countries
      $scope.trip.id = snapshot.key()

      var messages = new Firebase("https://vitrualplanner.firebaseio.com/chats/" + $scope.trip.id + "/");

      var syncObject = $firebaseObject(messages);

      syncObject.$bindTo($scope,"messages").then(function(){
      });

      var files= new Firebase("https://vitrualplanner.firebaseio.com/files/" + $scope.trip.id + "/");

      var syncObject2 = $firebaseObject(files);

      syncObject2.$bindTo($scope,"files").then(function(){
      });


    });
    $scope.markersRef2.on("value",function(snapshot){
    snapshot.forEach(function(childSnapshot) {
      //first wee add the marker to the $scope.markers. If we created the marker in this session it will be already exist in the $scope.markers and we will not add it

      var marker = childSnapshot.val();
      marker.date = new Date(marker.date);
      var markerIndex = markers.containMarker(childSnapshot.key(),$scope.markerIndex,$scope.markers);
      if ( markerIndex !== -1){
        $scope.markers[markerIndex].address = marker.address;
        $scope.markers[markerIndex].coords = marker.coords;
        $scope.markers[markerIndex].date = marker.date;
        $scope.markers[markerIndex].description = marker.description;
        $scope.markers[markerIndex].eventIcon = marker.eventIcon;
        $scope.markers[markerIndex].locationResults = marker.locationResults;
        $scope.markers[markerIndex].options = marker.options;
        $scope.markers[markerIndex].phone = marker.phone;
        $scope.markers[markerIndex].price = marker.price;
        $scope.markers[markerIndex].timeStamp = marker.timeStamp;
        $scope.markers[markerIndex].title = marker.title;
        $scope.markers[markerIndex].type = marker.type;
        $scope.markers[markerIndex].id = markerIndex;
        markers.initMarkersSizeUrl($scope.markers)
      }
      else if ( markerIndex === -1 ){
        marker.markerFirebaseKey = childSnapshot.key();
        marker.id = $scope.markerIndex;
        marker.infoEdit = false;
        marker.infoInsert = true;
        marker.window = {
          options :{
            visible: false
          }
        };
        marker.tmpurl = marker.options.icon.url;
        marker.events = {
          click: function(marker, eventName, model) {
            var indexes = markers.containEventInDays(marker.key,$scope.days);
            $scope.modeService.setEventMode($scope,$scope.days[indexes.i].events[indexes.j],$scope.days[indexes.i]);
          },
          mouseover: function(marker, eventName, model) {

          },
          mouseout: function(marker, eventName, model) {
            for (var i = 0; i < $scope.markers.length; i++) {
              if ($scope.markers[i].active === false){
                $scope.markers[i].options.icon.url = $scope.markers[i].tmpurl;
              }
            }
            markers.initMarkersSizeUrl($scope.markers);
          }

        };
        marker.active = false;
        $scope.markers.push(marker);
        $scope.markers.sort(function(a,b){
          if(a.date < b.date){
            return -1;
          }
          else{
            return 1;
          }
        });
        markers.initMarkersSizeUrl($scope.markers)
        $scope.markerIndex = $scope.markerIndex + 1;
      }

      var event = {
        markerFirebaseKey : childSnapshot.key(),
        title : marker.title,
        coords: marker.coords,
        locationResults : marker.locationResults,
        type: marker.type,
        description : marker.description,
        date: marker.date,
        address: marker.address,
        price: marker.price,
        phone: marker.phone,
        eventIcon : marker.eventIcon
      };
      //Check if the date was update. If so delete the previous event from the day
      var indexes = markers.containEventInDays(event.markerFirebaseKey,$scope.days);
      if(indexes !== null){
        if(event.date !== $scope.days[indexes.i].events[indexes.j].date){
          $scope.days[indexes.i].events.splice(indexes.j,1);
          if($scope.days[indexes.i].events.length === 0){
            $scope.days.splice(indexes.i,1);
          }
        }
      }

      //Check if this marker was the last marker that was added

      //second wee add the event to the $scope.days. First we check if the day is exist, if not we create a new day and
      //add the new event otherwise we check if the event exist in the event array of the existing day. If not we add the event.
      var dayIndex = markers.containDay(marker.date,$scope.days);
      if (dayIndex !== -1) {
        var eventIndex = markers.containEvent(event.markerFirebaseKey,dayIndex,$scope.days);
        if (eventIndex === -1){
          $scope.days[dayIndex].events.push(event);
          $scope.days[dayIndex].expenses = $scope.days[dayIndex].expenses + event.price;
          $scope.days[dayIndex].events.sort(function(dayA,dayB){return dayA.date.getHours() - dayB.date.getHours();});
          if ($scope.timeStamp < marker.timeStamp){
            $scope.timeStamp = marker.timeStamp;
            $scope.timestampDay = dayIndex;
            $scope.timestampEvent = event;
          }
        }
        else{
          $scope.days[dayIndex].expenses = $scope.days[dayIndex].expenses - $scope.days[dayIndex].events[eventIndex].price;
          $scope.days[dayIndex].expenses = $scope.days[dayIndex].expenses + event.price;
          $scope.days[dayIndex].events[eventIndex] = event;
          $scope.days[dayIndex].events.sort(function(dayA,dayB){return dayA.date.getHours() - dayB.date.getHours();});
          if ($scope.timeStamp < marker.timeStamp){
            $scope.timeStamp = marker.timeStamp;
            $scope.timestampDay = dayIndex;
            $scope.timestampEvent = event;
          }
        }
      }
      else{
        var day = {
          date: marker.date,
          newEventWindow: false,
          location: "תל אביב",
          wheather: {
            general: "חם מאד",
            temp : "37",
            icon: "images/right-bar/weather-icon-1.png"
          },
          expenses: marker.price,
          title: "",
          events: [],
          showEvents : false,
          toggleIcon : true,
          active: false
        };
        day.events.push(event);
        $scope.days.push(day);
        dayIndex = markers.containDay(marker.date,$scope.days);
        $scope.days[dayIndex].index = dayIndex+1;
        if ($scope.timeStamp < marker.timeStamp){
          $scope.timeStamp = marker.timeStamp;
          $scope.timestampDay = dayIndex;
          $scope.timestampEvent = event;
        }
      }


      $scope.days.sort(function(a,b) {return (a.date > b.date) ? 1 : ((b.date > a.date) ? -1 : 0);} );
      if($scope.days.length > 0){
        var daybegin = $scope.days[0].date;
        for (var i = 0; i < $scope.days.length; i++) {
          $scope.days[i].index = $scope.daysBetween(daybegin,$scope.days[i].date)+1
        }
      }

      for (i = 0; i < $scope.days[$scope.timestampDay].events.length; i++) {
        if ($scope.days[$scope.timestampDay].events[i] === $scope.timestampEvent){
          $scope.timestampEventIndex = i;
        }
      }

      modes.setEventMode2($scope,$scope.days[$scope.timestampDay].events[$scope.timestampEventIndex],$scope.days[$scope.timestampDay]);
      $scope.setBoundes($scope.markers);
      $scope.marker = $scope.markers[0];
      });
    });

      //end of firebase fetching

    //map section, left screen section
    $scope.setIcon = function(iconmarkerIndex){
      //console.log("setIcon function")
      var icon = "";
      switch(iconmarkerIndex) {
          case 1:
              icon = "images/map/map-pin-1.png";
              break;
          case 2:
              icon =  "images/map/map-pin-2.png";
              break;
          case 3:
              icon =  "images/map/map-pin-3.png";
              break;
          case 4:
              icon =  "images/map/map-pin-4.png";
              break;
          case 5:
              icon = "images/map/map-pin-5.png";
              break;
          case 6:
              icon = "images/map/map-pin-6.png";
              break;
          default:
              icon = "images/map/map-pin-1.png";
      }
      return icon;
    };

    $scope.getActiveImg = function(index){
      var img = "";
      switch(index) {
              case 1:
                  img =  "images/map/map-pin-active-1.png";
                  break;
              case 2:
                  img = "images/map/map-pin-active-2.png";
                  break;
              case 3:
                  img = "images/map/map-pin-active-3.png";
                  break;
              case 4:
                  img = "images/map/map-pin-active-4.png";
                  break;
              case 5:
                  img = "images/map/map-pin-active-5.png";
                  break;
              case 6:
                  img = "images/map/map-pin-active-6.png";
                  break;
              default:
                  img = "images/map/map-pin-active-1.png";
          }
      return img;
    };


    $scope.drawingManagerOptions = {
        // drawingMode: google.maps.drawing.OverlayType.MARKER,
        drawingControl: true,
        drawingControlOptions: {
          position: google.maps.ControlPosition.TOP_CENTER,
            drawingModes: [
              google.maps.drawing.OverlayType.MARKER,
            ]
        },
    };
    $scope.windowOptions = {
      };

    $scope.eventMouseEnter= function(event){
      for (var i = 0; i < $scope.markers.length; i++) {
        var tmpMarker = $scope.markers[i];
        if (tmpMarker.markerFirebaseKey === event.markerFirebaseKey){
          $scope.markers[i].tmpIcon = $scope.markers[i].options.icon.url;
          // $scope.markers[i].options.icon = "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
          var tmpCoords = {
            latitude : $scope.markers[i].coords.latitude,
            longitude : $scope.markers[i].coords.longitude
          };
          $scope.map.center = tmpCoords;
        }
        else {
          $scope.markers[i].tmpIcon = $scope.markers[i].options.icon.url;
          // $scope.markers[i].options.icon.url = "images/map/map-pin-0.png"
        }
      }
    };

    $scope.eventMouseLeave= function(event){
      for (var i = 0; i < $scope.markers.length; i++) {
          $scope.markers[i].options.icon.url = $scope.markers[i].tmpIcon;

      }
    };

    $scope.typeMouseEnter = function(type){
      if (!type.active){
        type.showName = true;
      }
    };

    $scope.typeMouseLeave = function(type){
      if (!type.active){
        type.showName = false;
      }
    };

    $scope.setCategory = function(type){
      //TODO need to init new event
      for (var i = 0; i < $scope.types.length; i++) {
        if ($scope.types[i] === type){
          $scope.types[i].style = "{'border': 1px solid black;}";
          $scope.types[i].active = true;
          $scope.types[i].showName = false;
        }
        else{
          $scope.types[i].style = "";
          $scope.types[i].active = false;
          $scope.types[i].showName = false;
        }
      }
    };

    $scope.getType = function(type){
      var typeAns = "";
      switch(type) {
              case 1:
                  typeAns = "מסעדה";
                  break;
              case 2:
                  typeAns = "טיסה";
                  break;
              case 3:
                  typeAns = "תרבות";
                  break;
              case 4:
                  typeAns = "תחבורה";
                  break;
              case 5:
                  typeAns = "פעילות";
                  break;
              case 6:
                  typeAns ="לינה";
                  break;
              default:
                  typeAns = "מסעדה";
      }
      return typeAns;
    };

    $scope.newEvent = {};

    $scope.initNewEvent = function(){
      $scope.newEvent = {};
    };

    $scope.eventHandler ={
      //When adding a new marker.
      markercomplete: function (dm, name, scope, objs) {
        var markerComplete = objs[0];
        console.log($scope.tmpEditEvent);
        markerComplete.visible = false;
        // $scope.markerComplete[0].visible = true

        if($scope.addEventMode){
          $scope.newEvent.coords = {
                latitude: objs[0].position.lat(),
                longitude: objs[0].position.lng()
          };
        }
        if($scope.editEventMode){
          $scope.tmpEditEvent.coords = {
                latitude: objs[0].position.lat(),
                longitude: objs[0].position.lng()
          };
          var index = markers.containMarker($scope.tmpEditEvent.markerFirebaseKey,$scope.markers)
          console.log("EDIT MARKER LOCATION");
          console.log($scope.markers[index]);
          $scope.markers[index].coords = $scope.tmpEditEvent.coords;
        }
        }

    };

    //Autocomplete google maps
      $scope.newEvent.newLocation = {
        details: '',
        results: '',
        options: null
      };
    //add new event
    $scope.addNewEvent = function(newEvent,locationDetails){
      var date = newEvent.date;
      if (newEvent.type === undefined){
        newEvent.type = 1;
      }
      if (newEvent.time !== undefined){
        date.setHours(newEvent.time.getHours(),newEvent.time.getMinutes());
      }
      var tmpEvent = {};
      tmpEvent.date = date.toString();
      tmpEvent.eventIcon = $scope.types[newEvent.type-1].img.toString();
      tmpEvent.iconUrl = $scope.setIcon(newEvent.type).toString();
      tmpEvent.description = (newEvent.description !== undefined) ? newEvent.description : "";
      tmpEvent.phone = (newEvent.phone !== undefined) ? newEvent.phone : "No phone";
      tmpEvent.price = (newEvent.price !== undefined) ? newEvent.price : 0;
      tmpEvent.title = newEvent.title;
      tmpEvent.type = newEvent.type;
      if (!$scope.mapLocationMode){
        var address = "";
        if (locationDetails === ""){
          $scope.newEvent.locationValid = false;
          return false;
        }
        $scope.locationValid = true;
        for (var i = 0; i < locationDetails.address_components.length; i++) {
          address = address + "," + locationDetails.address_components[i].long_name;
        }
        tmpEvent.address = address;

        $scope.markersRef.$add({
          locationResults:newEvent.newLocation.results,
              address : tmpEvent.address,
              coords: {
                latitude: locationDetails.geometry.location.lat(),
                longitude: locationDetails.geometry.location.lng()
              },
          date: tmpEvent.date,
          description:tmpEvent.description,
          eventIcon : tmpEvent.eventIcon,
              options: {
                icon: {
                  url : tmpEvent.iconUrl
                }
            },
          phone: tmpEvent.phone,
          price : tmpEvent.price,
          type : tmpEvent.type,
          title: tmpEvent.title,
              window : {
                options : {
                  visible : false
                }
              },
              timeStamp : $scope.timeStamp + 1
        }).then(function(ref) {
              console.log("Add new marker to map");
              console.log(ref);
              $scope.setFormLocationMode()
        });
      }
      else {
        $scope.markersRef.$add({
              coords: {
                latitude: newEvent.coords.latitude,
                longitude: newEvent.coords.longitude
              },
          date: tmpEvent.date,
          description: tmpEvent.description,
          eventIcon : tmpEvent.eventIcon,
          options: {
                icon: {
                  url : $scope.setIcon(newEvent.type).toString()
                }
          },
          phone: tmpEvent.phone,
          price : tmpEvent.price,
          type : tmpEvent.type,
          title: tmpEvent.title,
          window : {
                options : {
                  visible : false
                }
          },
          timeStamp : $scope.timeStamp + 1
        }).then(function(ref) {
              $scope.tmpRef = ref;
              console.log("Add new marker to map");
              $scope.setFormLocationMode()

        });
        $scope.markerComplete[0].visible = false
      }
      //finish to add new place to firebase
    };

    $scope.setMapLocationMode = function(){
      console.log("setMapLicationMode");
      $scope.drawingManagerOptions.drawingMode = google.maps.drawing.OverlayType.MARKER;
      $scope.mapLocationMode = true;
    };

    $scope.setFormLocationMode = function(){
      console.log("setFormLicationMode");
      $scope.drawingManagerOptions.drawingMode = "";
      $scope.mapLocationMode = false;

    };


    // right screen
    $scope.dayToggle = function(day){
      day.showEvents = !day.showEvents;
      if (day.showEvents){
        for (var i = 0; i < $scope.days.length; i++) {
          $scope.days[i].active = false;
        }
        day.active = true;
        day.toggleIcon = false;
      }
      else{
        day.active = false;
        day.toggleIcon = true	;
      }
    };

    $scope.dayToggleTrue= function(day){
      day.showEvents = true;
      if (day.showEvents){
        for (var i = 0; i < $scope.days.length; i++) {
          $scope.days[i].active = false;
        }
        day.active = true;
        day.toggleIcon = false;
      }
      else{
        day.active = false;
        day.toggleIcon = true	;
      }
    }

    $scope.editEvent = function(event){
      var firebaseKey = event.markerFirebaseKey;
      var date = event.date;
      if (event.type === undefined){
        event.type = 1;
      }
      if (event.time !== undefined){
        date.setHours(event.time.getHours(),event.time.getMinutes());
      }
      var tmpEvent = {
          newLocation: event.newLocation,
          date: date.toString(),
          eventIcon: $scope.types[event.type - 1].img.toString(),
          iconUrl: $scope.setIcon(event.type).toString(),
          description: (event.description !== undefined) ? event.description : "",
          phone: (event.phone !== undefined) ? event.phone : "No phone",
          price : (event.price !== undefined) ? event.price : 0,
          title : event.title,
          type : event.type
      };
      //Update everything except of the location
      if (!$scope.mapLocationMode){
        var address = "";
        if (event.newLocation !== "" && event.newLocation !== undefined){
          var locationDetails = event.newLocation.details;
          $scope.locationValid = true;
          for (var i = 0; i < locationDetails.address_components.length; i++) {
            address = address + "," + locationDetails.address_components[i].long_name;
          }
          tmpEvent.address = address;
          $scope.markersRef2.child(firebaseKey).update({
            locationResults:tmpEvent.newLocation.results,
                address : tmpEvent.address,
                coords: {
                  latitude: locationDetails.geometry.location.lat(),
                  longitude: locationDetails.geometry.location.lng()
                }
          },function(ref) {
                console.log("Update the location");
                console.log(ref);
          });
        }
      }
      else {
        $scope.markersRef2.child(firebaseKey).update({
              coords: {
                latitude: event.coords.latitude,
                longitude: event.coords.longitude
              },
              address : null,
              locationResults : null
        },function(ref) {
              $scope.tmpRef = ref;
              console.log("Add new marker to map");

        });
      }
      $scope.markersRef2.child(firebaseKey).update({
        date: tmpEvent.date,
        description:tmpEvent.description,
        eventIcon : tmpEvent.eventIcon,
            options: {
              icon: {
                url : tmpEvent.iconUrl
              }
          },
          phone: tmpEvent.phone,
          price : tmpEvent.price,
          type : tmpEvent.type,
        title: tmpEvent.title,
            window : {
              options : {
                visible : false
              }
            },
            timeStamp : $scope.timeStamp + 1
      },function(ref) {
            console.log("Update all the event's data");
            console.log(ref);
      });
      console.log("MARKERCOMPLETE visible");
      console.log("setFormLicationMode");
      $scope.drawingManagerOptions.drawingMode = "";
      $scope.mapLocationMode = false;
      //finish to add new place to firebase
    };

    $scope.deleteEvent = function(event){
      $scope.markersRef2.child(event.markerFirebaseKey).remove();
      var indexes = markers.containEventInDays(event.markerFirebaseKey,$scope.days);
      $scope.days[indexes.i].events.splice(indexes.j,1);
      if($scope.days[indexes.i].events.length == 0){
        $scope.days.splice(indexes.i,1)
      }
      modes.setEditEventModeSimple(false);
      modes.setAddEventModeSimple(false);
      modes.setDayModeSimple(true);
      modes.setEventModeSimple(false);
      var markerIndex = markers.containMarker(event.markerFirebaseKey,$scope.markerIndex,$scope.markers);
      $scope.markers.splice(markerIndex,1)

    }

    $scope.cancelEdit = function(){
      var index = markers.containMarker($scope.tmpEditEvent.markerFirebaseKey,$scope.markers);
      $scope.markers[index].coords = $scope.markers[index].tmpCoords;
      modes.setEditEventModeSimple(false);
      modes.setAddEventModeSimple(false);
      modes.setDayModeSimple(false);
      modes.setEventModeSimple(true);
      $scope.drawingManagerOptions.drawingMode = "";
      $scope.mapLocationMode = false;
    };
    // end of calendar section

    // //Chat section

    $scope.Auth = Auth;
    $scope.newMessage = {
      uid : Auth.$getAuth().auth.uid,
      name : Auth.$getAuth().auth.token.email,
      text : null,
      file : null
    }

    $scope.sendMessage = function(message,trip_id){
      message.timestamp = Firebase.ServerValue.TIMESTAMP;
      $scope.newMessage = chatService.initMessage(Auth.$getAuth().auth.uid);
      chatService.sendMessage(message, trip_id).then(function (ref) {
        console.log("new message added with id " + ref.key());
      }, function (error) {
        console.log(error)
      })
      return;
    }

    //Date picker

    $scope.currentDate = new Date();
    this.showDatePicker = function(ev) {
      $mdpDatePicker($scope.currentDate, {
        targetEvent: ev
      }).then(function(selectedDate) {
        $scope.currentDate = selectedDate;
      });;
    };

    this.filterDate = function(date) {
      return moment(date).date() % 2 == 0;
    };

    this.showTimePicker = function(ev) {
      $mdpTimePicker($scope.currentTime, {
        targetEvent: ev
      }).then(function(selectedDate) {
        $scope.currentTime = selectedDate;
      });;
    }
    //files section

    var uploader = $scope.uploader = new FileUploader({
      url: 'upload.php'
    });

    // FILTERS

    uploader.filters.push({
      name: 'customFilter',
      fn: function(item /*{File|FileLikeObject}*/, options) {
        return this.queue.length < 10;
      }
    });

    // CALLBACKS
    uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
      console.info('onWhenAddingFileFailed', item, filter, options);
    };
    uploader.onAfterAddingFile = function(fileItem) {
      console.info('onAfterAddingFile', fileItem);
    };
    uploader.onAfterAddingAll = function(addedFileItems) {
      console.info('onAfterAddingAll', addedFileItems);
    };
    uploader.onBeforeUploadItem = function(item) {
      console.info('onBeforeUploadItem', item);
    };
    uploader.onProgressItem = function(fileItem, progress) {
      console.info('onProgressItem', fileItem, progress);
    };
    uploader.onProgressAll = function(progress) {
      console.info('onProgressAll', progress);
    };
    uploader.onSuccessItem = function(fileItem, response, status, headers) {
      console.info('onSuccessItem', fileItem, response, status, headers);
    };
    uploader.onErrorItem = function(fileItem, response, status, headers) {
      console.info('onErrorItem', fileItem, response, status, headers);
    };
    uploader.onCancelItem = function(fileItem, response, status, headers) {
      console.info('onCancelItem', fileItem, response, status, headers);
    };
    uploader.onCompleteItem = function(fileItem, response, status, headers) {
      console.info('onCompleteItem', fileItem, response, status, headers);
    };
    uploader.onCompleteAll = function() {
      console.info('onCompleteAll');
    };

    console.info('uploader', uploader);


    //Directions section
    $scope.direction = {}

    $scope.getSelectedText = function(selectedItem) {
      if (selectedItem !== undefined) {
        return "<i class='" + selectedItem.icon + "' aria-hidden='true'></i> " + selectedItem.title;
      } else {
        return "בחר תחבורה";
      }
    };

    $scope.getSelectedTextMakrer = function(marker){
      if (marker !== undefined) {
        return "<img src='" + marker.options.icon.url + "'width='10px;' alt=''> <span>" + marker.title + "</span>"
      } else {
        return "בחר מקום";
      }
    }

    //end of chat section
    //video chat section
    // $scope.showVideo = true;
    // $scope.mute = true;
    // var webrtc = new SimpleWebRTC({
    //     // the id/element dom element that will hold "our" video
    //     localVideoEl: 'localVideo',
    //     // the id/element dom element that will hold remote videos
    //     remoteVideosEl: 'remoteVideos',
    //     // immediately ask for camera access
    //     autoRequestMedia: true
    // });
    // // we have to wait until it's ready
    // webrtc.on('readyToCall', function () {
    //     // you can name it anything
    //     webrtc.joinRoom('myRoom');
    // });
    // $scope.video = webrtc

    // $scope.muteSound = function(){
    // 	$scope.mute = true;
    // 	$scope.video.mute()
    // 	//console.log($scope.mute)
    // }

    // $scope.playSound = function(){
    // 	$scope.mute = false;
    // 	$scope.video.unmute()
    // }

    // $scope.stopVideo = function(){
    // 	$scope.showVideo = false;
    // 	$scope.video.pauseVideo();
    // }

    // $scope.startVideo = function(){
    // 	$scope.showVideo = true;
    // 	$scope.video.resumeVideo();
    // }

    //end of video chat section
  });
