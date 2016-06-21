'use strict';

/**
 * @ngdoc function
 * @name tipntripVpApp.controller:AuthctrlCtrl
 * @description
 * # AuthctrlCtrl
 * Controller of the tipntripVpApp
 */
angular.module('tipntripVpApp')
  .controller('AuthCtrl', function(Auth, $state,$scope){
    $scope.loginActive = true;
    $scope.loginUser = {
    	email: '',
    	password: '',
    };

    $scope.registerUser = {
    	email: '',
    	password: '',
    	passRepeat: ''
    }
    $scope.loginError = false
    $scope.registerError = false
    $scope.error = ""
    $scope.tmpError = ""
    $scope.connect = 
	//Login  	
	$scope.login = function (){
	  console.log("login")	  
	  Auth.$authWithPassword($scope.loginUser).then(function (auth){
	    console.log(auth)
	    $scope.loginError = false
	    $scope.user = Auth.$getAuth().auth.token.email
	    $scope.connect = true
	    $state.go('acount');

	  }, function (error){
	  	console.log("Error")
	  	$scope.loginError = true
	  	$scope.tmpError = error.code
		switch(error.code){
			case "INVALID_USER":
				$scope.error = "The specified user does not exist."
				break;
			case "INVALID_PASSWORD":
				$scope.error = "The specified password is incorrect."
				break;
			default:
			    $scope.error = "The input is not valid"			
		}	  	
	    console.log(error)
	  });
	};
	//Register
	$scope.register = function (){
	  Auth.$createUser($scope.registerUser).then(function (user){
	    $scope.loginUser.email =  $scope.registerUser.email
	    $scope.loginUser.password =  $scope.registerUser.password
	    $scope.registerError = false
	    $scope.login();
	  }, function (error){
	  	$scope.tmpError = error.code
	  	console.log("Register error")
	  	console.log(error)
	  	$scope.registerError = true
	    switch(error.code){
			case "INVALID_EMAIL":
				$scope.error = "The mail is not valid."
				break;
			case "EMAIL_TAKEN":
				$scope.error = "The mail is taken."
				break;
			default:
			    $scope.error = "The input is not valid"	
		}
	  });
	};

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
