'use strict';

/**
 * @ngdoc service
 * @name tipntripVpApp.user
 * @description
 * # user
 * Service in the tipntripVpApp.
 */
angular.module('tipntripVpApp')
  .service('user', function (rootRef,$firebaseObject,$firebaseArray) {
    var usersRef = rootRef.child('users');
    this.getUser = function get(uid) {
      return $firebaseObject(usersRef.child(uid));
    };
    this.all = function all(){
      return $firebaseArray(usersRef)
    };
  });
