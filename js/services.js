//*****************************************************************************************************************
// Copyright � 2014 - 2015 Lahuna. All rights reserved.
// You may not copy, reproduce, republish, disassemble, decompile, reverse engineer, post, broadcast, transmit, or
// make available to the public any content or code on this website without prior written permission from Lahuna.
//*****************************************************************************************************************

'use strict';

/* Services */

var Services = angular.module('Services', ['ngResource']);

// Send Email
Services.factory('SendEmailResource', ['$resource',
  function ($resource) {
      return $resource("todo/common/send-email", {}, {
          Send: {
              method: 'GET'
          }
      });
  }]);

// Get Api
//Services.factory('GetApiResource', ['$resource',
  //function ($resource) {
      //return $resource("todo/common/get-api", {}, {
          //Get: {
              //method: 'GET'
          //}
      //});
  //}]);
