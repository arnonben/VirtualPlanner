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
        editEventMode = false;eventMode = false;dayMode = false;addEventMode = true;
        console.log("ADD_EVENT");
        console.log(scope);
        scope.newEvent.date = scope.currentDay.date;
        console.log(scope.newEvent);
        scope.markersService.initMarkersSizeUrl(scope.markers);
        scope.setFormLocationMode();
      },

      setEditEventMode : function(scope,event,markers){
        scope.$parent.showFiles = false;
        scope.setFormLocationMode();
        //init the category
        scope.setCategory(scope.types[event.type-1]);
        scope.tmpEditEvent = {};

        //deep copy the event
        angular.copy(event,scope.tmpEditEvent);

        scope.tmpEditEvent.locationResults = event.locationResults;

        scope.tmpEditEvent.tmpCoords = scope.tmpEditEvent.coords;
        console.log(scope.markersService)
        var index = scope.markersService.containMarker(event.markerFirebaseKey,event.id,scope.markers);
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
      }
  };
});
