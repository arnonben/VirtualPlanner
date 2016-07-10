'use strict';

/**
 * @ngdoc directive
 * @name tipntripVpApp.directive:imageOnLoadDirective
 * @description
 * # imageOnLoadDirective
 */
angular.module('tipntripVpApp')
  .directive('imageOnLoadDirective', function() {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        element.bind('load', function() {
          if(attrs.islast == "true"){
            $(".chat-message").animate({ scrollTop: $('.chat-message').prop("scrollHeight")}, 100);
          }
        });
      }
    };
  });
