//*****************************************************************************************************************
// Copyright � 2014 - 2015 Lahuna. All rights reserved.
// You may not copy, reproduce, republish, disassemble, decompile, reverse engineer, post, broadcast, transmit, or
// make available to the public any content or code on this website without prior written permission from Lahuna.
//*****************************************************************************************************************

'use strict';

var res = angular.module('Resources', ['ngResource']);

// Send Email
res.factory('EmailResource', function ($resource) {
  return $resource(location.origin + ':8000/email', {}, {
    Send: {
        method: 'GET'
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
