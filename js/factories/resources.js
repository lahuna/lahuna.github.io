//*****************************************************************************************************************
// Copyright � 2014 - 2016 Lahuna. All rights reserved.
// You may not copy, reproduce, republish, disassemble, decompile, reverse engineer, post, broadcast, transmit, or
// make available to the public any content or code on this website without prior written permission from Lahuna.
//*****************************************************************************************************************

'use strict';

var res = angular.module('Resources', ['ngResource']);

// Send Email
res.factory('EmailResource', function ($resource) {
  return $resource('https://40.78.104.169:8000/email', {}, {
    Send: {
        method: 'GET'
    }
  });
});

// Log
res.factory('LogResource', function ($resource) {
  return $resource('https://40.78.104.169:8000/log', {}, {
    Get: {
      method: 'GET',
      params: { 'site': location.hostname }
    },
    Post: {
      method: 'POST',
      params: { 'site': location.hostname }
    },
    Delete: {
      method: 'DELETE',
      params: { 'site': location.hostname }
    }
  });
});

// Get Api
//Services.factory('GetApiResource', ['$resource',
  //function ($resource) {
      //return $resource("https://lahuna-need-to-fix-this/common/get-api", {}, {
          //Get: {
              //method: 'GET'
          //}
      //});
  //}]);
