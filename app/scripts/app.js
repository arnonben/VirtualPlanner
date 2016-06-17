'use strict';

/**
 * @ngdoc overview
 * @name tipntripVpApp
 * @description
 * # tipntripVpApp
 *
 * Main module of the application.
 */
angular
  .module('tipntripVpApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'uiGmapgoogle-maps',
    'ui.timepicker',
    'firebase',
    'ngAutocomplete',
    'firebase',
    'firebase.ref',
    'firebase.auth'    
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
