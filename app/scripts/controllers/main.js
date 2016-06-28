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
  .controller('MainCtrl', function ($scope,$stateParams,$log, $timeout,$firebaseArray,categories,markers,Auth,$firebaseObject) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    console.log($stateParams);
	$scope.types = categories.getCategories();
    //The markers array contains all the markers from the map
    $scope.markers = [];
    //The days array contains all the days of the trip. 
    //Each day contains its wheather, title and the events array
    $scope.days = [];
    $scope.markerIndex = 1;
    //The eventmode daymode addeventmode define the mode of the middle screen
    $scope.eventMode = true;
    $scope.dayMode = false;
    $scope.addEventMode = false;
    
    $scope.attachFileHover = false;
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
        		//console.log("click function " + $scope.$id)
     //    		for (var i = 0; i < $scope.markers.length; i++) {
					// $scope.markers[i].options.icon.url = $scope.markers[i].tmpurl
					// $scope.markers[i].options.icon.scaledSize =  new google.maps.Size(40, 60)
					// $scope.markers[i].options.labelAnchor = '17 52'
					// $scope.markers[i].options.labelContent = 
					// 	'<div class="bold" style="font-size:20px; color:white;width:35px;">' + $scope.markers[i].id + '</div>' 

        		   		
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
    console.log("ref");
    console.log("https://vitrualplanner.firebaseio.com/" + uid + "/trips/" + tripid +"/markers");
    $scope.ref = new Firebase("https://vitrualplanner.firebaseio.com/" + uid + "/trips/" + tripid);
    $scope.markersRef = $firebaseArray(new Firebase("https://vitrualplanner.firebaseio.com/" + uid + "/trips/" + tripid +"/markers"));
    $scope.markersRef2 = new Firebase("https://vitrualplanner.firebaseio.com/" + uid + "/trips/" + tripid +"/markers");

    	$scope.setEventMode = function(event,day){
	    $scope.eventMode = true;
	    $scope.dayMode = false;
	    $scope.addEventMode = false;
	    for (var i = 0; i < $scope.days.length; i++) {
	    	for (var j = 0; j < $scope.days[i].events.length; j++) {
	    		$scope.days[i].events[j].active = false;
	    	}
	    }
	    event.active = true;
	    $scope.currentEvent = event;
	    $scope.currentDay = day;
		var tmpCoords = {
			latitude : event.coords.latitude,
			longitude : event.coords.longitude
		};
		$scope.map.center = tmpCoords;
		$scope.map.zoom = 11;	    
	};
	//Set event mode for a new event withought the zoom
	$scope.setEventMode2 = function(event,day){
	    $scope.eventMode = true;
	    $scope.dayMode = false;
	    $scope.addEventMode = false;
	    for (var i = 0; i < $scope.days.length; i++) {
		    $scope.days[i].active = false;
		    $scope.days[i].toggleIcon = true;
		    $scope.days[i].showEvents = false;
	    	for (var j = 0; j < $scope.days[i].events.length; j++) {
	    		$scope.days[i].events[j].active = false;
	    	}
	    }
	    event.active = true;
	    day.active = true;
	    day.toggleIcon = false;
	    day.showEvents = true;
	    $scope.currentEvent = event;
	    $scope.currentDay = day;	    
	};

	$scope.setBoundes = function(markers){
		var bounds = new google.maps.LatLngBounds();
		for (var i=0; i<markers.length; i++){ 
			var markerBound = new google.maps.LatLng(markers[i].coords.latitude,markers[i].coords.longitude);
		    bounds.extend(markerBound);
			}
		$scope.map.bounds = {
		    northeast: {
		        latitude: bounds.getNorthEast().lat(),
		        longitude: bounds.getNorthEast().lng()
		    },
		    southwest: {
		        latitude: bounds.getSouthWest().lat(),
		        longitude: bounds.getSouthWest().lng()
		    }
		};		
	};

    //Init page methods
    //Firebase fetch all events and markers
    $scope.markersRef2.on("value",function(snapshot){
		snapshot.forEach(function(childSnapshot) {
			//first wee add the marker to the $scope.markers. If we created the marker in this session it will be already exist in the $scope.markers and we will not add it

			var marker = childSnapshot.val();
			marker.date = new Date(marker.date);
			var markerIndex = markers.containMarker(childSnapshot.key(),$scope.markerIndex,$scope.markers);
			if ( markerIndex === -1 ){
				marker.markerFirebaseKey = childSnapshot.key();
				marker.id = $scope.markerIndex;
				marker.infoEdit = false;
				marker.infoInsert = true;
				marker.options = {
					icon : {
						url : marker.options.icon.url,
						scaledSize : new google.maps.Size(90, 130)
					},
					labelClass:'marker_labels',
					labelAnchor:'17 120',
					labelContent:'<div class="bold" style="font-size:40px; color:white;width:36px;">' + marker.id + '</div>'
				};
				marker.tmpurl = marker.options.icon.url;
				marker.events = {
					click: function(marker, eventName, model) {
						markers.initMarkersSizeUrl($scope.markers);
						$scope.markers[marker.key-1].options.icon.url = $scope.getActiveImg($scope.markers[marker.key-1].type);
						$scope.markers[marker.key-1].options.icon.scaledSize =  new google.maps.Size(90, 130);
						$scope.markers[marker.key-1].options.labelContent = 
						'<div class="flex-icon-active">' +
						'<div class="flex-icon-active-item-2 white" style="font-size:15px; color:white;">' + $scope.markers[marker.key-1].title +'</div>' +
						'<div class="flex-icon-active-item-1 bold" style="font-size:20px; color:white;">' + $scope.markers[marker.key-1].id + '</div>' +						
						'</div>';

						$scope.markers[marker.key-1].options.labelAnchor = '60 70';
						$scope.markers[marker.key-1].active = true;
						for (var i = 0; i < $scope.markers.length; i++) {
							if (i !== marker.key-1){
								$scope.markers[i].active = false;
							}
						}
					},
					mouseover: function(marker, eventName, model) {
						// for (var i = 0; i < $scope.markers.length; i++) {
						// 	if (i != marker.key-1){
						// 		$scope.markers[i].active = false
						// 		$scope.markers[i].options.icon.url = "images/map/map-pin-0.png"
						// 	}
						// };
					},
					mouseout: function(marker, eventName, model) {
						for (var i = 0; i < $scope.markers.length; i++) {
							if ($scope.markers[i].active === false){
								$scope.markers[i].options.icon.url = $scope.markers[i].tmpurl;
							}
						}
						markers.initMarkersSizeUrl($scope.markers);
					},

				};
				marker.active = false;			
				$scope.markers.push(marker);
				$scope.markerIndex = $scope.markerIndex + 1;
			}

			var event = {
				markerFirebaseKey : childSnapshot.key(),
				title : marker.title,
				coords: marker.coords,
				type: marker.type,
				description : marker.description,
				date: marker.date,
				address: marker.address,
				price: marker.price,
				phone: marker.phone,
				eventIcon
				: marker.eventIcon
			};
			
			//Check if this marker was the last marker that was added

			//second wee add the event to the $scope.days. First we check if the day is exist, if not we create a new day and 
			//add the new event otherwise we check if the event exist in the event array of the existing day. If not we add the event.
			var dayIndex = markers.containDay(marker.date,$scope.days);
			if (dayIndex !== -1) {
				//console.log("test1")
				var eventIndex = markers.containEvent(event.markerFirebaseKey,dayIndex,$scope.days);
				//console.log(eventIndex)
				if (eventIndex === -1){
					$scope.days[dayIndex].events.push(event);
					$scope.days[dayIndex].expenses = $scope.days[dayIndex].expenses + event.price;	
					//console.log($scope.days[dayIndex])
					$scope.days[dayIndex].events.sort(function(dayA,dayB){return dayA.date.getHours() - dayB.date.getHours();});
					////console.log("add event from firebase");
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
						icon: "images/right-bar/weather-icons/weather-icon-1.png"
					},
					expenses: marker.price,
					title: "",
					events: [],
					showEvents : false,
					toggleIcon : true,
					active: false
				};
				//console.log(day);
				day.events.push(event);
				$scope.days.push(day);
				//console.log(day)

				//$scope.days.sort(function(dayA,dayB){return dayA.date - dayB.date})
				dayIndex = markers.containDay(marker.date,$scope.days);
				$scope.days[dayIndex].index = dayIndex+1;
				//console.log(dayIndex+1)
				//console.log("add day from firebase");
				//console.log("add event from firebase")
				if ($scope.timeStamp < marker.timeStamp){
					$scope.timeStamp = marker.timeStamp;
					$scope.timestampDay = dayIndex;
					$scope.timestampEvent = event;
				}				
			}
			for (var i = 0; i < $scope.days[$scope.timestampDay].events.length; i++) {
				if ($scope.days[$scope.timestampDay].events[i] === $scope.timestampEvent){
					$scope.timestampEventIndex = i;
				}
			}

			$scope.setEventMode2($scope.days[$scope.timestampDay].events[$scope.timestampEventIndex],$scope.days[$scope.timestampDay]);
			$scope.setBoundes($scope.markers);
	    });
    });

    //end of firebase fetching

	//map section, left screen section
	$scope.setIcon = function(iconmarkerIndex){
		//console.log("setIcon function")
		console.log("setIcon");
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
				$scope.markers[i].coords = $scope.markers[i].coords;
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


	//Middle screen change modes

	$scope.setDayMode = function(day){
	    $scope.eventMode = false;
	    $scope.dayMode = true;
	    $scope.addEventMode = false;
	    $scope.currentDay = day;
	    for (var i = 0; i < $scope.days.length; i++) {
	    	$scope.days[i].active = false;
	    	for (var j = 0; j < $scope.days[i].events.length; j++) {
	    		$scope.days[i].events[j].active = false;
	    	}
	    }
	    markers.initMarkersSizeUrl($scope.markers);
	    day.active = true;
	};

	$scope.setAddEventMode = function(){
		$scope.eventMode = false;
		$scope.dayMode = false;
		$scope.addEventMode = true;
		markers.initMarkersSizeUrl($scope.markers);
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
				        typeAns = "לינה";
				        break;
				    case 4:
				        typeAns = "תרבות";
				        break;
				    case 5:
				        typeAns = "תחבורה";
				        break;
				    case 6:
				        typeAns ="פעילות";
				        break;
				    default:
				        typeAns = "מסעדה";
		}
		return typeAns;	
	};

	//Add event
	$scope.timeTitle = true;
	$scope.timeActive = false;
	$scope.timeResult = false;

	$scope.setTimeActive = function(){
		$scope.timeTitle = false;
		$scope.timeActive = true;
		$scope.timeResult = false;		
	};

	$scope.setTimeNotActive = function(time){
		if (time === undefined){
			$scope.timeTitle = true;
			$scope.timeActive = false;
			$scope.timeResult = false;		
		}
		else {
			$scope.timeTitle = false;
			$scope.timeActive = false;
			$scope.timeResult = true;			
		}
	};

	$scope.dateTitle = true;
	$scope.dateActive = false;
	$scope.dateResult = false;	

	$scope.setDateActive = function(){
		$scope.dateTitle = false;
		$scope.dateActive = true;
		$scope.dateResult = false;		
	};

	$scope.setDateNotActive = function(date){
		if (date === undefined){
			$scope.dateTitle = true;
			$scope.dateActive = false;
			$scope.dateResult = false;		
		}
		else {
			$scope.dateTitle = false;
			$scope.dateActive = false;
			$scope.dateResult = true;			
		}
	};

	$scope.priceTitle = true;
	$scope.priceActive = false;
	$scope.priceResult = false;	

	$scope.setPriceActive = function(){
		$scope.priceTitle = false;
		$scope.priceActive = true;
		$scope.priceResult = false;		
	};

	$scope.setPriceNotActive = function(price){
		if (price === undefined){
			$scope.priceTitle = true;
			$scope.priceActive = false;
			$scope.priceResult = false;		
		}
		else {
			$scope.priceTitle = false;
			$scope.priceActive = false;
			$scope.priceResult = true;		
		}
	};

	$scope.newEvent = {};
	
	$scope.initNewEvent = function(){
		$scope.newEvent = {};
	};

	$scope.eventHandler ={
		//When adding a new marker.
		markercomplete: function (dm, name, scope, objs) {
			$scope.newEvent.coords = {
	        	latitude: objs[0].position.lat(),
	        	longitude: objs[0].position.lng()
			};
	    }

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
				$scope.locationValid = false;
				return false;
			}
			$scope.locationValid = true;
			for (var i = 0; i < locationDetails.address_components.length; i++) {
				address = address + "," + locationDetails.address_components[i].long_name;
			}	
			tmpEvent.address = address;

			$scope.markersRef.$add({ 
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

			});
		}
		// var tmpDate = new Date(tmpEvent.date.getFullYear(), tmpEvent.date.getMonth(), tmpEvent.date.getDate(),0,0,0,0)
		// var dayInDays = -1;
		// var found = false
		// for (var i = 0; i < $scope.days.length && !found; i++) {
		// 	if($scope.days[i].date == tmpDate){
		// 		dayInDays = -1
		// 	}
		// 	else{
		// 		if ($scope.days[i].date.getFullYear() > tmp.getFullYear()){

		// 		}
		// 	}
		// };
		var dayDate = tmpEvent.date.get;
		// setDayMode()

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

	//Autocomplete google maps
    $scope.newLocation = {
    	details: '',
    	results: '',
    	options: null
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
		console.log("false");
	};


	// end of calendar section
	 
    //Chat section
    console.log($stateParams);
    $scope.traveler = {
    	uid : $stateParams.travUid,
    	email : $stateParams.travEmail
    };
    $scope.advisor = {
    	uid : $stateParams.advisorUid,
    	email : $stateParams.advisorEmail
    };
    $scope.user1 = {};
    $scope.user2 = {} ;
    $scope.whoAmI = function(){
    	if(Auth.$getAuth().auth.uid === $scope.traveler.uid){
    		$scope.user1 = $scope.traveler;
    		$scope.user2 = $scope.advisor;
    	}
    	else{
    		$scope.user1 = $scope.advisor;
    		$scope.user2 = $scope.traveler;  		
    	}
    };

    $scope.whoAmI();

    $scope.newMessage = "";
    $scope.chatPath = "https://vitrualplanner.firebaseio.com/chats/" + $scope.advisor.uid + "/" + $scope.traveler.uid + "/messages/";
    $scope.chatsRef = new Firebase($scope.chatPath);
 	// download the data into a local object
    var syncObject = $firebaseObject($scope.chatsRef);
    // synchronize the object with a three-way data binding
    // click on `index.html` above to see it used in the DOM!
    syncObject.$bindTo($scope, "messages").then(function(){
      console.log("messages");
    });    

    $scope.sendMessage = function(newMessage){
    	console.log(newMessage);
    	console.log($scope.newMessage);
		var messagesList =  $scope.chatsRef.push();
    	messagesList.set({
    		text: newMessage,
    		user: $scope.user1,
            timeStamp: Date.now()
    	},
    	function(error){
    		if(error){
    			console.log(error);
    		}
    		else{
    			$scope.newMessage = "";
    			console.log("New message was sent saved");
    			console.log($scope);
    		}
    	});    	
    };
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
