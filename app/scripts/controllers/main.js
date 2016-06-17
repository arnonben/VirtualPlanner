'use strict';

/**
 * @ngdoc function
 * @name tipntripVpApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the tipntripVpApp
 /images/middle-bar/add-event/event-types/event-type1.png
 */
angular.module('tipntripVpApp')
  .controller('MainCtrl', function ($scope,$log, $timeout,$firebaseArray) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma',
    ];
	var cat1 = {
		img: "images/middle-bar/add-event/event-types/event-type1.png",
		name: "אוכל",
		index : 1,
		style: "",
		showName: false,
	}
	var cat2 = {
		img: "images/middle-bar/add-event/event-types/event-type2.png",
		name: "טיסה",
		index : 2,
		style: "",
		showName: false,		
	}
	var cat3 = {
		img: "images/middle-bar/add-event/event-types/event-type3.png",
		name: "לינה",
		index : 3,
		style: "",
		showName: false,		
	}
	var cat4 ={
		img: "images/middle-bar/add-event/event-types/event-type4.png",
		name: "תרבות",
		index : 4,
		style: "",
		showName: false,	
	}	    	    	
	var cat5 = {
		img: "images/middle-bar/add-event/event-types/event-type5.png",
		name: "תחבורה",
		index : 5,
		style: "",
		showName: false,		
	}
	var cat6 = {
		img: "images/middle-bar/add-event/event-types/event-type6.png",
		name: "פעילות",
		index : 6,
		style: "",
		showName: false,		
	}   
	$scope.types = []
	$scope.types.push(cat1)
	$scope.types.push(cat2)
	$scope.types.push(cat3)
	$scope.types.push(cat4)
	$scope.types.push(cat5)
	$scope.types.push(cat6)

    $scope.markers = []
    $scope.days = []
    $scope.markerIndex = 1
    $scope.eventMode = true
    $scope.dayMode = false
    $scope.addEventMode = false
    $scope.attachFileHover = false
    $scope.mapLocationMode = false

    //New event
    //TODO create a service for the firebase ref.
    $scope.ref = new Firebase("https://vitrualplanner.firebaseio.com/trip1/");

    $scope.markersRef = $firebaseArray(new Firebase("https://vitrualplanner.firebaseio.com/trip1/markers"));
    $scope.markersRef2 = new Firebase("https://vitrualplanner.firebaseio.com/trip1/markers");

    //Init page methods

    // firebase fetch all events and markers
    $scope.markersRef2.on("value",function(snapshot){
		snapshot.forEach(function(childSnapshot) {
			//first wee add the marker to the $scope.markers. If we created the marker in this session it will be already exist in the $scope.markers and we will not add it

			var marker = childSnapshot.val();
			marker.date = new Date(marker.date);
			var markerIndex = $scope.containMarker(childSnapshot.key(),$scope.markerIndex);
			if ( markerIndex == -1 ){
				marker.markerFirebaseKey = childSnapshot.key();
				marker.id = $scope.markerIndex
				marker.infoEdit = false
				marker.infoInsert = true
				marker.options = {
					icon : {
						url : marker.options.icon.url,
						scaledSize : new google.maps.Size(40, 60)
					},
					labelClass:'marker_labels',
					labelAnchor:'17 52',
					labelContent:'<div class="bold" style="font-size:20px; color:white;width:35px;">' + marker.id + '</div>'
				}
				marker.tmpurl = marker.options.icon.url
				marker.events = {
					click: function(marker, eventName, model) {
						$scope.markers[marker.key-1].options.icon.url = $scope.getActiveImg($scope.markers[marker.key-1].type)
						$scope.markers[marker.key-1].options.icon.scaledSize =  new google.maps.Size(150, 90)
						$scope.markers[marker.key-1].options.labelContent = 
						'<div class="flex-icon-active">' +
						'<div class="flex-icon-active-item-2 white" style="font-size:15px; color:white;">' + $scope.markers[marker.key-1].title +'</div>' +
						'<div class="flex-icon-active-item-1 bold" style="font-size:20px; color:white;">' + $scope.markers[marker.key-1].id + '</div>' +						
						'</div>'

						$scope.markers[marker.key-1].options.labelAnchor = '60 70'
						$scope.markers[marker.key-1].active = true
						for (var i = 0; i < $scope.markers.length; i++) {
							if (i != marker.key-1){
								$scope.markers[i].active = false
							}
						};
					},
					mouseover: function(marker, eventName, model) {
						for (var i = 0; i < $scope.markers.length; i++) {
							if (i != marker.key-1){
								$scope.markers[i].active = false
								$scope.markers[i].tmpurl = $scope.markers[i].options.icon.url
								$scope.markers[i].options.icon.url = "images/map/map-pin-6.png"
							}
						};
					},
					mouseout: function(marker, eventName, model) {
						for (var i = 0; i < $scope.markers.length; i++) {
							if ($scope.markers[i].active == false){
								$scope.markers[i].options.icon.url = $scope.markers[i].tmpurl
							}
						};						
					},

				}	
				marker.active = false;			
				$scope.markers.push(marker)
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
			}
			//second wee add the event to the $scope.days. First we check if the day is exist, if not we create a new day and 
			//add the new event otherwise we check if the event exist in the event array of the existing day. If not we add the event.
			var dayIndex = $scope.containDay(marker.date);
			if (dayIndex != -1) {
				//console.log("test1")
				var eventIndex = $scope.containEvent(event.markerFirebaseKey,dayIndex);
				//console.log(eventIndex)
				if (eventIndex == -1){
					$scope.days[dayIndex].events.push(event);
					$scope.days[dayIndex].expenses = $scope.days[dayIndex].expenses + event.price	
					//console.log($scope.days[dayIndex])
					$scope.days[dayIndex].events.sort(function(dayA,dayB){return dayA.date.getHours() - dayB.date.getHours()})
					////console.log("add event from firebase");
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
				}
				//console.log(day);
				day.events.push(event);
				$scope.days.push(day);
				console.log(day)

				//$scope.days.sort(function(dayA,dayB){return dayA.date - dayB.date})
				var dayIndex = $scope.containDay(marker.date);
				$scope.days[dayIndex].index = dayIndex+1
				console.log(dayIndex+1)
				//console.log("add day from firebase");
				//console.log("add event from firebase")
			}					
	    });
		$scope.days[0].events[0].active = true
		$scope.currentEvent = $scope.days[0].events[0] 
		$scope.days[0].active = true
		$scope.days[0].showEvents = true
		$scope.days[0].toggleIcon = false
		$scope.currentDay = $scope.days[0]

		var tmpCoords = {
			latitude : $scope.markers[0].coords.latitude,
			longitude : $scope.markers[0].coords.longitude
		}
		$scope.map.center = tmpCoords
		$scope.map.zoom = 10

    })

    $scope.containEvent = function(markerFirebaseKey,dayIndex){
    	for (var i = 0; i < $scope.days[dayIndex].events.length; i++) {
    		if ($scope.days[dayIndex].events[i].markerFirebaseKey === markerFirebaseKey) {
    			return i;
    		}
    	}
    	return -1;
    }  

	$scope.containDay = function(date){
		for (var i = 0; i < $scope.days.length; i++) {
			if($scope.days[i].date.getDate() == date.getDate() && $scope.days[i].date.getMonth() == date.getMonth() && $scope.days[i].date.getFullYear() == date.getFullYear() )
				return i;
		}
		return -1;
	}

    $scope.containMarker = function(markerFirebaseKey,id){
    	for (var i = 0; i < $scope.markers.length; i++) {
    		if ($scope.markers[i].markerFirebaseKey === markerFirebaseKey) {
    			return i;
    		}
    		//Only for the first time we create the marker when he still doesnt have a firebase key.
    		if ($scope.markers[i].id === id){
    			return i;
    		}
    	}
    	return -1;
    } 
    //end of firebase fetching

	// map section
	$scope.setIcon = function(iconmarkerIndex){
		//console.log("setIcon function")
		console.log("setIcon")
		switch(iconmarkerIndex) {
		    case 1:
		        return "images/map/map-pin-1.png"
		        break;
		    case 2:
		        return "images/map/map-pin-2.png"
		        break;
		    case 3:
		        return "images/map/map-pin-3.png"
		        break;
		    case 4:
		        return "images/map/map-pin-4.png"
		        break;
		    case 5:
		        return "images/map/map-pin-5.png"
		        break;
		    default:
		        return "images/map/map-pin-1.png"
		}
	}

	$scope.getActiveImg = function(index){
		switch(index) {
				    case 1:
				        return "images/map/map-pin-active-1.png"
				        break;
				    case 2:
				        return "images/map/map-pin-active-2.png"
				        break;
				    case 3:
				        return "images/map/map-pin-active-3.png"
				        break;
				    case 4:
				        return "images/map/map-pin-active-4.png"
				        break;
				    case 5:
				        return "images/map/map-pin-active-5.png"
				        break;
				    default:
				        return "images/map/map-pin-active-1.png"
				}		
	}


	//Add place and event

	$scope.insertPlace = function(i,marker){
		//Add new marker into $scope.markers
		$scope.markers[i].infoInsert = true;
		$scope.markers[i].infoEdit = false;	
		$scope.markers[i].title = marker.title;
		$scope.markers[i].description = marker.description;
		$scope.markers[i].date = marker.date;
		$scope.markers[i].options.icon = $scope.setIcon(marker.color);
		$scope.markers[i].tmpurl = $scope.setIcon(marker.color);

		//Add marker to the firebase
		$scope.markersRef.$add({ 
	      	coords: {
	        	latitude: $scope.markers[i].coords.latitude,
	        	longitude: $scope.markers[i].coords.longitude
	      	},
			date: $scope.markers[i].date.toString(),
			description: $scope.markers[i].description,
	        infoInsert: true,
	        infoEdit: false,
	      	options: {
	      		icon: $scope.markers[i].options.icon
		    },
			title: $scope.markers[i].title,
	        window : {
	      		options : {
	      			visible : false
	      		}
	      	}
		}).then(function(ref) {
			  	var id = ref.key();
			  	$scope.markers[i].markerFirebaseKey = id;
		});
		//finish to add new place to firebase
	};

	$scope.startEditMode = function(i){
		//console.log("Edit place " + i);
		$scope.markers[i].infoEdit = true;
		$scope.markers[i].infoInsert = false;
	}

	$scope.editPlace = function(i,marker){
		//console.log("content")
		//console.log($scope.markers[i].window.options.content)
		//First we update the marker in the firebase and than we delete the marker from $scope.markers and from $scope.events
		var tmpMarker = $scope.markers[i];
		tmpMarker.date = marker.date.toString()
		tmpMarker.title = marker.title
		tmpMarker.description = marker.description
		$scope.markersRef2.child($scope.markers[i].markerFirebaseKey).set(tmpMarker,function(error){
			if(error){
				//console.log("Edit marker failed");
			}
			else{
				//console.log("Edit marker sucessed")
				var dayIndex = $scope.findDayAndEvent($scope.markers[i].markerFirebaseKey).i;
				var eventIndex = $scope.findDayAndEvent($scope.markers[i].markerFirebaseKey).j;
				//console.log("dayIndex "+dayIndex+" eventIndex "+eventIndex)
				$scope.markers[i].date = new Date($scope.markers[i].date)
				$scope.markers[i].infoEdit = false;
				$scope.markers[i].infoInsert = true;
				$scope.days[dayIndex].events.splice(eventIndex,1)
			}

		});	
		$scope.markers[i].infoEdit = false;
		$scope.markers[i].infoInsert = true;

	}

	$scope.canceEditlPlace = function(i){
		//console.log("cancel place")
		$scope.markers[i].infoEdit = false;
		$scope.markers[i].infoInsert = true;
	}

	$scope.cancelAddPlace = function(i){
		$scope.markers.splice(i, 1);
	}

	$scope.deletePlace = function(i){
		//console.log("delete marker " + i)
		//console.log($scope.markers[i].firebaseKey)
		var key = $scope.markers[i].markerFirebaseKey
		//delete from firebase
		$scope.markersRef2.child($scope.markers[i].markerFirebaseKey).remove(function(error){
		    if (error) {
		    //console.log("Error:", error);
		  } else {
		    //console.log("Removed successfully!");
		  }
		});
		//delete from local array markers and events
		$scope.markers.splice(i, 1);
		var indexes = $scope.findDayAndEvent(key)
		var dayIndex = indexes.i;
		var eventIndex = indexes.j;
		$scope.days[dayIndex].events.splice(eventIndex,1);
	}

	$scope.findDayAndEvent = function(markerFirebaseKey){
		for (var i = 0; i < $scope.days.length; i++) {
			for (var j = 0; j < $scope.days[i].events.length; j++) {
				if (markerFirebaseKey === $scope.days[i].events[j].markerFirebaseKey){
					return {i:i,j:j};
				}
			}
		}
		return {i:-1,j:-1};
	}
   
    $scope.map = {
        zoom: 3,
		center: {latitude: 40.1451, longitude: -99.6680 },
        mapTypeId: google.maps.MapTypeId.TERRAIN,
        options: {

        },
        events:{
        	click: function(){
        		//console.log("click function " + $scope.$id)
        		for (var i = 0; i < $scope.markers.length; i++) {
					$scope.markers[i].options.icon.url = $scope.markers[i].tmpurl
					$scope.markers[i].options.icon.scaledSize =  new google.maps.Size(40, 60)
					$scope.markers[i].options.labelAnchor = '17 52'
					$scope.markers[i].options.labelContent = 
						'<div class="bold" style="font-size:20px; color:white;width:35px;">' + $scope.markers[i].id + '</div>' 

        		}   		
    			$scope.$apply();
        	}
        }
    }

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

	$scope.onClick = function(markerIndex) {
		//console.log("onclick")
		for (var i = 0; i < $scope.markers.length; i++) {
			$scope.markers[i].window.options.visible = false;
		};
        $scope.markers[markerIndex].window.options.visible = true;
		$scope.$apply();        
    };

    $scope.closeClick = function(markerIndex) {
    	//console.log(markerIndex);
        $scope.markers[markerIndex].window.options.visible = false;
    };

	$scope.hoverInEvent = function(event){
		for (var i = 0; i < $scope.markers.length; i++) {
			if($scope.markers[i].markerFirebaseKey === event.markerFirebaseKey){
				$scope.markers[i].window.options.visible = true;
			}
			else{
				$scope.markers[i].window.options.visible = false;	
			}
		};
	} 

	$scope.hoverOutEvent = function(event){
		for (var i = 0; i < $scope.markers.length; i++) {
			if($scope.markers[i].markerFirebaseKey === event.markerFirebaseKey){
				$scope.markers[i].window.options.visible = false;
			}
		};
	}

	$scope.eventMouseEnter= function(event){
		for (var i = 0; i < $scope.markers.length; i++) {
			var tmpMarker = $scope.markers[i]
			if (tmpMarker.markerFirebaseKey == event.markerFirebaseKey){
				$scope.markers[i].tmpIcon = $scope.markers[i].options.icon.url
				// $scope.markers[i].options.icon = "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
				var tmpCoords = {
					latitude : $scope.markers[i].coords.latitude,
					longitude : $scope.markers[i].coords.longitude
				}
				$scope.map.center = tmpCoords
				$scope.markers[i].coords = $scope.markers[i].coords
				$scope.map.zoom = 6
			}
			else {
				$scope.markers[i].tmpIcon = $scope.markers[i].options.icon.url
				$scope.markers[i].options.icon.url = "images/map/map-pin-6.png"
			}
		};
	}

	$scope.eventMouseLeave= function(event){	
		for (var i = 0; i < $scope.markers.length; i++) {
				$scope.markers[i].options.icon.url = $scope.markers[i].tmpIcon

		};
	}

	$scope.setEventMode = function(event,day){
	    $scope.eventMode = true
	    $scope.dayMode = false
	    $scope.addEventMode = false
	    for (var i = 0; i < $scope.days.length; i++) {
	    	for (var j = 0; j < $scope.days[i].events.length; j++) {
	    		$scope.days[i].events[j].active = false
	    	};
	    };
	    event.active = true
	    $scope.currentEvent = event
	    $scope.currentDay = day
		var tmpCoords = {
			latitude : event.coords.latitude,
			longitude : event.coords.longitude
		}
		$scope.map.center = tmpCoords
		$scope.map.zoom = 11	    
	}

	$scope.setDayMode = function(day){
	    $scope.eventMode = false
	    $scope.dayMode = true
	    $scope.addEventMode = false
	    $scope.currentDay = day
	}

	$scope.setAddEventMode = function(){
		$scope.eventMode = false;
		$scope.dayMode = false;
		$scope.addEventMode = true;
	}


	$scope.dayToggle = function(day){
		day.showEvents = !day.showEvents
		if (day.showEvents){
			for (var i = 0; i < $scope.days.length; i++) {
				$scope.days[i].active = false
			};
			day.active = true
			day.toggleIcon = false
		}
		else{
			day.active = false
			day.toggleIcon = true	
		}
		console.log("false")
	}

	$scope.typeMouseEnter = function(type){
		if (!type.active){
			type.showName = true
		}
	}

	$scope.typeMouseLeave = function(type){
		if (!type.active){
			type.showName = false	
		}
	}

	$scope.setCategory = function(type){
		//TODO need to init new event
		for (var i = 0; i < $scope.types.length; i++) {
			if ($scope.types[i] == type){
				$scope.types[i].style = "{'border': 1px solid black;}"
				$scope.types[i].active = true;
				$scope.types[i].showName = false;
			}
			else{
				$scope.types[i].style = ""
				$scope.types[i].active = false;
				$scope.types[i].showName = false;
			}
		};
	}

	$scope.getType = function(type){
		console.log(type)
		switch(type) {
				    case 1:
				        return "מסעדה"
				        break;
				    case 2:
				        return "טיסה"
				        break;
				    case 3:
				        return "לינה"
				        break;
				    case 4:
				        return "תרבות"
				        break;
				    case 5:
				        return "תחבורה"
				        break;
				    case 6:
				        return "פעילות"
				        break;
				    default:
				        return "מסעדה"
		}	
	}

	//Add event
	$scope.timeTitle = true
	$scope.timeActive = false
	$scope.timeResult = false

	$scope.setTimeActive = function(){
		$scope.timeTitle = false
		$scope.timeActive = true
		$scope.timeResult = false		
	}

	$scope.setTimeNotActive = function(time){
		if (time == undefined){
			$scope.timeTitle = true
			$scope.timeActive = false
			$scope.timeResult = false		
		}
		else {
			$scope.timeTitle = false
			$scope.timeActive = false
			$scope.timeResult = true			
		}
	}

	$scope.dateTitle = true
	$scope.dateActive = false
	$scope.dateResult = false	

	$scope.setDateActive = function(){
		$scope.dateTitle = false
		$scope.dateActive = true
		$scope.dateResult = false		
	}

	$scope.setDateNotActive = function(date){
		if (date == undefined){
			$scope.dateTitle = true
			$scope.dateActive = false
			$scope.dateResult = false		
		}
		else {
			$scope.dateTitle = false
			$scope.dateActive = false
			$scope.dateResult = true			
		}
	}

	$scope.priceTitle = true
	$scope.priceActive = false
	$scope.priceResult = false	

	$scope.setPriceActive = function(){
		$scope.priceTitle = false
		$scope.priceActive = true
		$scope.priceResult = false		
	}

	$scope.setPriceNotActive = function(price){
		if (price == undefined){
			$scope.priceTitle = true
			$scope.priceActive = false
			$scope.priceResult = false		
		}
		else {
			$scope.priceTitle = false
			$scope.priceActive = false
			$scope.priceResult = true			
		}
	}	

	$scope.newEvent = {}
	
	$scope.initNewEvent = function(){
		$scope.newEvent = {}
	}

	$scope.eventHandler ={
		//When adding a new marker.
		markercomplete: function (dm, name, scope, objs) {
			console.log(objs[0].position.lat())
			console.log(objs[0].position.lng())
			$scope.newEvent.coords = {
	        	latitude: objs[0].position.lat(),
	        	longitude: objs[0].position.lng()
			}
	    }

	};

	$scope.addNewEvent = function(newEvent,locationDetails){
		//console.log(locationDetails)
		//console.log(newEvent)
		//Add marker to the firebase
		console.log("type")
		console.log(newEvent.type)
		console.log($scope.setIcon(newEvent.type).toString())
		var date = newEvent.date
		date.setHours(newEvent.time.getHours(),newEvent.time.getMinutes())
		if (!$scope.mapLocationMode){
			var address = ""
			for (var i = 0; i < locationDetails.address_components.length; i++) {
				address = address + "," + locationDetails.address_components[i].long_name
			};			
			$scope.markersRef.$add({ 
		      	address : address,
		      	coords: {
		        	latitude: locationDetails.geometry.location.lat(),
		        	longitude: locationDetails.geometry.location.lng()
		      	},
				date: date.toString(),
				description: newEvent.description,
				eventIcon : $scope.types[newEvent.type-1].img.toString(),
		      	options: {
		      		icon: {
		      			url : $scope.setIcon(newEvent.type).toString()
		      		}
			    },
			    phone: newEvent.phone,
			    price : newEvent.price,
			    type : newEvent.type,
				title: newEvent.title,
		        window : {
		      		options : {
		      			visible : false
		      		}
		      	}
			}).then(function(ref) {
				  	console.log("Add new marker to map")
			});
		}
		else {
			$scope.markersRef.$add({ 
		      	coords: {
		        	latitude: newEvent.coords.latitude,
		        	longitude: newEvent.coords.longitude
		      	},
				date: date.toString(),
				description: newEvent.description,
				eventIcon : $scope.types[newEvent.type-1].img.toString(),
		      	options: {
		      		icon: {
		      			url : $scope.setIcon(newEvent.type).toString()
		      		}
			    },
			    phone: newEvent.phone,
			    price : newEvent.price,
			    type : newEvent.type,
				title: newEvent.title,
		        window : {
		      		options : {
		      			visible : false
		      		}
		      	}
			}).then(function(ref) {
				  	console.log("Add new marker to map")
			});
		}
		//finish to add new place to firebase
	}

	$scope.setMapLocationMode = function(){
		console.log("setMapLicationMode")
		$scope.drawingManagerOptions.drawingMode = google.maps.drawing.OverlayType.MARKER
		$scope.mapLocationMode = true
	}

	$scope.setFormLocationMode = function(){
		console.log("setFormLicationMode")
		$scope.drawingManagerOptions.drawingMode = ""
		$scope.mapLocationMode = false

	}

	//Autocomplete google maps
    $scope.result1 = '';
    $scope.options1 = null;
    $scope.details1 = '';

	// end of calendar section
	 
	//video chat section
	$scope.showVideo = true;
	$scope.mute = true;
	var webrtc = new SimpleWebRTC({
	    // the id/element dom element that will hold "our" video
	    localVideoEl: 'localVideo',
	    // the id/element dom element that will hold remote videos
	    remoteVideosEl: 'remoteVideos',
	    // immediately ask for camera access
	    autoRequestMedia: true
	});
	// we have to wait until it's ready
	webrtc.on('readyToCall', function () {
	    // you can name it anything
	    webrtc.joinRoom('myRoom');
	});
	$scope.video = webrtc

	$scope.muteSound = function(){
		$scope.mute = true;
		$scope.video.mute()
		//console.log($scope.mute)
	}

	$scope.playSound = function(){
		$scope.mute = false;
		$scope.video.unmute()
	}

	$scope.stopVideo = function(){
		$scope.showVideo = false;
		$scope.video.pauseVideo();
	}

	$scope.startVideo = function(){
		$scope.showVideo = true;
		$scope.video.resumeVideo();
	}

	//end of video chat section
});
