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
    'ui.router',
    'ngSanitize',
    'ngTouch',
    'uiGmapgoogle-maps',
    'ui.timepicker',
    'firebase',
    'ngAutocomplete',    
  ])
  .constant('FirebaseUrl', 'https://vitrualplanner.firebaseio.com')
  .config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/account");

    $stateProvider
      .state('login', {
        url: '/login',
        templateUrl: 'views/login.html',
        resolve: {
          requireNoAuth: function($state, Auth){
            return Auth.$requireAuth().then(function(auth){
              $state.go('vp');
            }, function(error){
              return;
            });
          }
        }        
      })
      .state('register', {
        url: '/register',
        templateUrl: 'views/register.html',
        resolve: {
          requireNoAuth: function($state, Auth){
            return Auth.$requireAuth().then(function(auth){
              $state.go('vp');
            }, function(error){
              return;
            });
          }
        }           
      }) 
      .state('acount', {
        url: '/account',
        templateUrl: 'views/account.html',
        controller: 'AccountCtrl',
        resolve: {
          requireNoAuth: function($state, Auth){
            return Auth.$requireAuth().then(function(auth){
              return
            }, function(error){
              $state.go('login');
            });
          }
        }           
      })   

      .state('addtrip', {
        url: '/addtrip',
        templateUrl: 'views/addtrip.html',
        controller: 'AddtripCtrl',
        resolve: {
          requireNoAuth: function($state, Auth){
            return Auth.$requireAuth().then(function(auth){
              return
            }, function(error){
              $state.go('login');
            });
          }
        }           
      })  

      .state('vp', {
        url: '/vp/:uid/:tripid',
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        resolve: {
          requireNoAuth: function($state, Auth){
            return Auth.$requireAuth().then(function(auth){
              return
            }, function(error){
              $state.go('login');
            });
          }
        }           
      })             
  });
