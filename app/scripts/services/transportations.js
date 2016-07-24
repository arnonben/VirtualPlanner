'use strict';

/**
 * @ngdoc service
 * @name tipntripVpApp.transportations
 * @description
 * # transportations
 * Factory in the tipntripVpApp.
 */
angular.module('tipntripVpApp')
  .factory('transportations', function () {
    // Service logic
    // ...

    var transportations = {
      driving: {
        travelMode: "DRIVING",
        title: "נהיגה",
        icon : "fa fa-car",
      },
      transit: {
        travelMode: "TRANSIT",
        title: "תחבורה ציבורית",
        icon : "fa fa-bus",
      },
      bicycling: {
        travelMode: "BICYCLING",
        title: "אופניים",
        icon : "fa fa-bicycle",
      }
    };

    // Public API here
    return {
      getAll: function () {
        return transportations;
      }
    };
  });
