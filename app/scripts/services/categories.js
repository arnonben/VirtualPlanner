'use strict';

/**
 * @ngdoc service
 * @name tipntripVpApp.categories
 * @description
 * # categories
 * Factory in the tipntripVpApp.
 */
angular.module('tipntripVpApp')
  .factory('categories', function () {
    // Service logic
    // ...

    var meaningOfLife = 42;

    // Public API here
    return {
      getCategories: function () {
        var cat1 = {
          img: "images/middle-bar/event-type1.png",
          name: "אוכל",
          index : 1,
          style: "",
          showName: false,
          active: true
        }
        var cat2 = {
          img: "images/middle-bar/event-type2.png",
          name: "טיסה",
          index : 2,
          style: "",
          showName: false,    
        }
        var cat3 = {
          img: "images/middle-bar/event-type3.png",
          name: "תרבות",
          index : 3,
          style: "",
          showName: false,    
        }
        var cat4 ={
          img: "images/middle-bar/event-type4.png",
          name: "תחבורה",
          index : 4,
          style: "",
          showName: false,  
        }             
        var cat5 = {
          img: "images/middle-bar/event-type5.png",
          name: "פעילות",
          index : 5,
          style: "",
          showName: false,    
        }
        var cat6 = {
          img: "images/middle-bar/event-type6.png",
          name: "לינה",
          index : 6,
          style: "",
          showName: false,    
        }   
        var types = []
        types.push(cat1)
        types.push(cat2)
        types.push(cat3)
        types.push(cat4)
        types.push(cat5)
        types.push(cat6)

        return types
      }
    };
  });
