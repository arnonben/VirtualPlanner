'use strict';

/**
 * @ngdoc directive
 * @name tipntripVpApp.directive:schrollBottom
 * @description
 * # schrollBottom
 */
angular.module('tipntripVpApp')
	.directive('schrollBottom', function () {
	  return {
	    scope: {
	      schrollBottom: "="
	    },
	    link: function (scope, element) {
	      scope.$watchCollection('schrollBottom', function (newValue) {
	        if (newValue)
	        {
	          /* jshint validthis: true */
	          (element).scrollTop((element)[0].scrollHeight);
	        }
	      });
	    }
	  };
	});
