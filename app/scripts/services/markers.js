'use strict';
/*global google */

/**
 * @ngdoc service
 * @name tipntripVpApp.markers
 * @description
 * # markers
 * Factory in the tipntripVpApp.
 */
angular.module('tipntripVpApp')
  .factory('markers', function () {
    // Service logic
    // ...


    // Public API here
    return {
      containEventInDays:function(markerFirebaseKey,days){
        for (var i = 0; i < days.length; i++) {
          for (var j = 0; j < days[i].events.length; j++) {
            if(days[i].events[j].markerFirebaseKey === markerFirebaseKey){
              return {i:i,j:j}
            }
          }
        }
        return null;
      },

      containEvent:function(markerFirebaseKey,dayIndex,days){
        for (var i = 0; i < days[dayIndex].events.length; i++) {
          if (days[dayIndex].events[i].markerFirebaseKey === markerFirebaseKey) {
            return i;
          }
        }
        return -1;
      },
      containDay:function(date,days){
        for (var i = 0; i < days.length; i++) {
          if(days[i].date.getDate() === date.getDate() && days[i].date.getMonth() === date.getMonth() && days[i].date.getFullYear() === date.getFullYear() ){
            return i;
          }
        }
        return -1;
      },

      containMarker : function(markerFirebaseKey,id,markers){
        for (var i = 0; i < markers.length; i++) {
          if (markers[i].markerFirebaseKey === markerFirebaseKey) {
            return i;
          }
          //Only for the first time we create the marker when he still doesnt have a firebase key.
          if (markers[i].id === id){
            return i;
          }
        }
        return -1;
      },

      initMarkersSizeUrl: function(markers){
        /* jshint ignore:start */
        var j = 0;
        for (var i = 0; i < markers.length; i++) {
          markers[i].options.icon.url = markers[i].tmpurl
          markers[i].options.icon.scaledSize = new google.maps.Size(30, 50)
          markers[i].options.labelClass = 'marker_labels',
          markers[i].options.labelAnchor = '17 45',
          j = i+1;
          markers[i].options.labelContent = '<div class="bold" style="font-size:20px; color:white;width:35px;">' + j + '</div>';
        }
        /* jshint ignore:end */
      }
    };
  });
