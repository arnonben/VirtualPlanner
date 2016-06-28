'use strict';

/**
 * @ngdoc filter
 * @name tipntripVpApp.filter:temp.filter
 * @function
 * @description
 * # temp.filter
 * Filter in the tipntripVpApp.
 */
angular.module('tipntripVpApp')
  .filter('temp', function () {
    return function(celsius, targetUnit) {
        if (celsius === undefined || celsius === null) {
            return '';
        }
        switch(targetUnit) {
            case 'celsius':
                return celsius + '°';
            case 'fahrenheit':
                return celsius * 1.8 + 32 + '°';
            default:
                return '';
        }
    }
  });
