'use strict';

/**
 * @ngdoc service
 * @name tipntripVpApp.chat
 * @description
 * # chat
 * Factory in the tipntripVpApp.
 */
angular.module('tipntripVpApp')
  .factory('chatService', function ($firebaseArray, $q) {


    var service = {
      sendMessage: sendMessage,
      initMessage: initMessage
    };


    return service;


    function sendMessage(newMessage,trip_id) {

      var defer = $q.defer();

      if (!trip_id) {

        defer.reject("Please select chat to send message");
        return defer.promise;
      }

      if (!newMessage.text && !newMessage.file) {
        defer.reject("Please type message or select file to send message");
        return defer.promise;
      }

      /* Handle file thing */
      if (newMessage.file) {
        var f = newMessage.file;
        var reader = new FileReader();
        reader.onload = (function (theFile) {

          return function (e) {

            if (f.size >= 10485760) {
              /* Firebase supports only 10 MB node size */
              defer.reject("Cannot upload files with size more than 10MB");
              return defer.promise;
            }

            newMessage.file = {
              payload: e.target.result,
              name: f.name,
              type: f.type,
              size: f.size,
              createdAt: Firebase.ServerValue.TIMESTAMP
            };

            saveFile(newMessage.file,trip_id)
            /* Save message with file */
            saveMessage(newMessage, trip_id)
              .then(function (ref) {
                defer.resolve(ref);
              }, function (error) {
                defer.reject(error);
              });

          };
        })(f);
        reader.readAsDataURL(f);

      } else {

        /* Save message with text only */
        saveMessage(newMessage, trip_id)
          .then(function (ref) {
            defer.resolve(ref);
          }, function (error) {
            defer.reject(error);
          });
      }

      return defer.promise;

    }

    function saveMessage(message,trip_id) {

      var defer = $q.defer();
      console.log(trip_id)
      var messagesRef = new Firebase("https://vitrualplanner.firebaseio.com/chats/" + trip_id + "/");
      $firebaseArray(messagesRef).$add(message).then(
        // success promise callback
        function (ref) {
          message.id = ref.key();

          /* On success updated chat's modified time to order chats modification time */
          defer.resolve(ref);

        },
        // error promise callback
        function (error) {
          defer.reject(error);
        }
      );

      return defer.promise;

    }

    function saveFile(file,trip_id) {

      var defer = $q.defer();
      console.log(trip_id)
      var messagesRef = new Firebase("https://vitrualplanner.firebaseio.com/files/" + trip_id + "/");
      $firebaseArray(messagesRef).$add(file).then(
        // success promise callback
        function (ref) {
          file.id = ref.key();

          /* On success updated chat's modified time to order chats modification time */
          defer.resolve(ref);

        },
        // error promise callback
        function (error) {
          defer.reject(error);
        }
      );

      return defer.promise;

    }

    function initMessage(uid) {
      var newMessage = {
        text: null,
        createdAt: Firebase.ServerValue.TIMESTAMP,
        uid: uid,
        file: null
      };
      return newMessage;
    }

  });
