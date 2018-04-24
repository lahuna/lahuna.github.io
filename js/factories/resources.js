//*****************************************************************************************************************
// Copyright 2014-2018 Lahuna. All rights reserved.
// You may not copy, reproduce, republish, disassemble, decompile, reverse engineer, post, broadcast, transmit, or
// make available to the public any content or code on this website without prior written permission from Lahuna.
//*****************************************************************************************************************

'use strict';

var res = angular.module('Resources', ['ngResource']);

// Send Email
res.factory('EmailResource', function ($resource) {
  return $resource('https://lahuna.net/email', {}, {
    Send: {
        method: 'GET'
    }
  });
});

// Log
res.factory('LogResource', function ($resource) {
  return $resource('https://lahuna.net/log', {}, {
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

// Wiki
res.factory('WikiResource', function ($resource) {
  return $resource('https://en.wikipedia.org/w/api.php', {}, {
    Get: {
      method: 'JSONP',
      isArray: false,
      headers: { 'User-Agent': 'Lahuna (https://lahuna.com/#/contact)' },
      params: { 'callback': 'JSON_CALLBACK' }
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
