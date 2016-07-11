'use strict';

/**
 * @ngdoc service
 * @name tipntripVpApp.modes
 * @description
 * # modes
 * Factory in the tipntripVpApp.
 */
angular.module('tipntripVpApp')
  .factory('modes', function () {
    //The eventmode daymode addeventmode editEventMode define the mode of the middle screen
    var eventMode = true;
    var dayMode = false;
    var addEventMode = false;
    var editEventMode = false;

    //Add event, fields modes
    var timeTitle = true;
    var timeActive = false;
    var timeResult = false;

    var dateTitle = true;

    var dateActive = false;
    var dateResult = false;

    var priceTitle = true;
    var priceActive = false;
    var priceResult = false;
    // Service logic
    // ...


    // Public API here
    return {
      //getters for the middle screen modes
      getEventMode : function(){return eventMode;},
      getDayMode : function(){return dayMode;},
      getAddEventMode : function(){return addEventMode;},
      getEditEventMode : function(){return editEventMode;},

      setEventModeSimple : function(bol){eventMode = bol;},
      setDayModeSimple  : function(bol){dayMode = bol;},
      setAddEventModeSimple  : function(bol){addEventMode = bol;},
      setEditEventModeSimple  : function(bol){editEventMode = bol;},


      //setters  getters for the add event form fields

      getTimeTitle : function(){return timeTitle;},
      getTimeActive : function(){return timeActive;},
      getTimeResults : function(){return timeResult;},


      getDateTitle : function(){return dateTitle;},
      getDateActive : function(){return dateActive;},
      getDateResults : function(){return dateResult;},

      getPriceTitle : function () {return priceTitle;},
      getPriceActive : function () {return priceActive;},
      getPriceResult : function () {return priceResult},

      setTimeTitleSimple  : function(bol){timeTitle = bol;},
      setTimeActiveSimple  : function(bol){timeActive = bol;},
      setTimeResultsSimple  : function(bol){timeResult = bol;},


      setDateTitleSimple  : function(bol){dateTitle = bol;},
      setDateActiveSimple  : function(bol){dateActive = bol;},
      setDateResultsSimple  : function(bol){dateResult = bol;},

      setPriceTitleSimple  : function(bol) {priceTitle = bol;},
      setPriceActiveSimple  : function(bol) {priceActive = bol;},
      setPriceResultSimple  : function(bol) {priceResult = bol;},

      setEventMode : function(scope,event,day){
          scope.$parent.showFiles = false
          console.log("SET_EVENT_MODE");
          editEventMode = false;
          eventMode = true;
          dayMode = false;
          addEventMode = false;
          for (var i = 0; i < scope.days.length; i++) {
            for (var j = 0; j < scope.days[i].events.length; j++) {
              scope.days[i].events[j].active = false;
            }
          }
          for (i = scope.markers.length - 1; i >= 0; i--) {
            if(scope.markers[i].markerFirebaseKey === event.markerFirebaseKey){
              scope.markers[i].window.options.visible = true;
            }
            else{
              scope.markers[i].window.options.visible = false
            }
          eventMode = true;
          dayMode = false;
          addEventMode = false;
          editEventMode = false;
          }
          event.active = true;
          scope.currentEvent = event;
          scope.currentDay = day;
      },

      //Set event mode for a new event withought the zoom
      setEventMode2 : function(scope,event,day){
        scope.$parent.showFiles = false;
        editEventMode = false;
        eventMode = true;
        dayMode = false;
        addEventMode = false;
        for (var i = 0; i < scope.days.length; i++) {
          scope.days[i].active = false;
          scope.days[i].toggleIcon = true;
          scope.days[i].showEvents = false;
          for (var j = 0; j < scope.days[i].events.length; j++) {
            scope.days[i].events[j].active = false;
          }
        }
        event.active = true;
        day.active = true;
        day.toggleIcon = false;
        day.showEvents = true;
        scope.currentEvent = event;
        scope.currentDay = day;
      },

      //Middle screen change modes
      setDayMode : function(scope,day){
        scope.$parent.showFiles = false;
        editEventMode = false;
        eventMode = false;
        dayMode = true;
        addEventMode = false;
        scope.currentDay = day;
        for (var i = 0; i < scope.days.length; i++) {
          scope.days[i].active = false;
          for (var j = 0; j < scope.days[i].events.length; j++) {
            scope.days[i].events[j].active = false;
          }
        }
        for (i = scope.markers.length - 1; i >= 0; i--) {
            scope.markers[i].window.options.visible = false
        }
          scope.markersService.initMarkersSizeUrl(scope.markers);
        day.active = true;
        var tmpMarkers = [];
        for (i = 0; i < day.events.length; i++) {
          var tmpFirebaseKey = day.events[i].markerFirebaseKey;
          for (var j=0; j<scope.markers.length; j++){
            if(scope.markers[j].markerFirebaseKey === tmpFirebaseKey){
              tmpMarkers.push(scope.markers[j])
            }
          }
        }
        scope.setBoundes(tmpMarkers);
      },

      setAddEventMode : function(scope){
        scope.$parent.showFiles = false;
        editEventMode = false;
        eventMode = false;
        dayMode = false;
        addEventMode = true;
        scope.markersService.initMarkersSizeUrl(scope.markers);
        scope.setFormLocationMode();
        timeResult=false;timeActive=false;timeTitle=true;
        dateResult=false;dateActive=false;dateTitle=true;
        priceResult=false;priceActive=false;priceTitle=true;
      },

      setEditEventMode : function(scope,event,markers){
        scope.$parent.showFiles = false;
        //init all the special input fields
        timeResult=true;timeActive=false;timeTitle=false;
        dateResult=true;dateActive=false;dateTitle=false;
        priceResult=true;priceActive=false;priceTitle=false;
        scope.setFormLocationMode();
        //init the category
        scope.setCategory(scope.types[event.type-1]);
        scope.tmpEditEvent = {};

        //deep copy the event
        angular.copy(event,scope.tmpEditEvent);

        scope.tmpEditEvent.locationResults = event.locationResults;

        scope.tmpEditEvent.tmpCoords = scope.tmpEditEvent.coords;
        console.log(scope.markersService)
        var index = scope.markersService.containMarker(event.markerFirebaseKey,scope.markers);
        scope.markers[index].tmpCoords = scope.markers[index].coords;
        //set the date and time
        scope.tmpEditEvent.time = new Date();
        scope.tmpEditEvent.time.setHours(event.date.getHours());
        scope.tmpEditEvent.time.setMinutes(event.date.getMinutes());
        scope.tmpEditEvent.time.setSeconds(0,0);

        //set edit event mode
        editEventMode = true;
        eventMode = false;
        dayMode = false;
        addEventMode = false;
      },

      setTimeActive : function(){
        timeTitle = false;
        timeActive = true;
        timeResult = false;
      },

      setTimeNotActive : function(time){
        if (time === undefined){
          timeTitle = true;
          timeActive = false;
          timeResult = false;
        }
        else {
          timeTitle = false;
          timeActive = false;
          timeResult = true;
        }
      },

      setDateActive : function(){
        dateTitle = false;
        dateActive = true;
        dateResult = false;
      },

      setDateNotActive : function(date){
        if (date === undefined){
          dateTitle = true;
          dateActive = false;
          dateResult = false;
        }
        else {
          dateTitle = false;
          dateActive = false;
          dateResult = true;
        }
      },

      setPriceActive : function(){
        priceTitle = false;
        priceActive = true;
        priceResult = false;
      },

      setPriceNotActive : function(price){
        if (price === undefined){
          priceTitle = true;
          priceActive = false;
          priceResult = false;
        }
        else {
          priceTitle = false;
          priceActive = false;
          priceResult = true;
        }
      }

  };
});
