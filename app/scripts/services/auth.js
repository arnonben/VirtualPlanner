'use strict';

/**
 * @ngdoc service
 * @name tipntripVpApp.Auth
 * @description
 * # Auth
 * Factory in the tipntripVpApp.
 */
angular.module('tipntripVpApp')
  .factory('Auth', function($firebaseAuth, FirebaseUrl){
    var ref = new Firebase(FirebaseUrl);
    var auth = $firebaseAuth(ref);

    return auth;

  });
