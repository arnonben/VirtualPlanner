'use strict';

/**
 * @ngdoc directive
 * @name tipntripVpApp.directive:focus
 * @description
 * # focus
 */
angular.module('tipntripVpApp')
  .directive('focus',['$timeout',function ($timeout) {
 return {
 	scope : {
 		trigger : '@focus'
 	},
 	link : function(scope, element) {
 		scope.$watch('trigger', function(value) {
 			if (value === "true") {
 				$timeout(function() {
 					element[0].focus();
 				});
 			}
 		});
 	}
 };
 
}]);
