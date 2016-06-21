'use strict';

/**
 * @ngdoc function
 * @name tipntripVpApp.controller:NavbarCtrl
 * @description
 * # NavbarCtrl
 * Controller of the tipntripVpApp
 */
angular.module('tipntripVpApp')
  .controller('NavbarCtrl', function ($scope,Auth,$state) {
  	$scope.auth = Auth
  	$scope.connect = false
  	if (Auth.$getAuth()){
	  	$scope.user = Auth.$getAuth().auth.token.email
	  	$scope.connect = true
	}

	$scope.logout = function(){
		$scope.user = ""
		Auth.$unauth()
	  	$scope.connect = false
	  	$state.go('login')

	}

  });
