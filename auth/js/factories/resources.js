//*****************************************************************************************************************
// Copyright 2014 - 2017 Lahuna. All rights reserved.
// You may not copy, reproduce, republish, disassemble, decompile, reverse engineer, post, broadcast, transmit, or
// make available to the public any content or code on this website without prior written permission from Lahuna.
//*****************************************************************************************************************

'use strict';

var fac = angular.module('AuthResourceFactory', ['ngResource']);

// Authenticate
fac.factory('AuthenticateResource', function ($resource) {
  return $resource('https://' + location.hostname + ':8000/google/authenticate', {}, {
    Get: {
      method: 'GET'
    }
  });
});

// Google Access Token
fac.factory('GoogleAccessTokenResource', function ($resource) {
  return $resource('https://' + location.hostname + ':8000/google/access_token', {}, {
    Post: {
      method: 'POST'
    }
  });
});

// Google Profile
/*fac.factory('GoogleProfileResource', function ($resource) {
  return function (accessToken) {
    return $resource('https://www.googleapis.com/plus/v1/people/me', {}, {
      Get: {
        method: 'GET',
        headers: { "Authorization": "Bearer " + accessToken }
      }
    });
  }
});*/

// Lahuna User
fac.factory('UserResource', function ($resource) {
  return $resource('https://' + location.hostname + ':8000/user', {}, {
    Get: {
      method: 'GET'
    },
    Post: {
      method: 'POST'
    },
  });
});
