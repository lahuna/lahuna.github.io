//*****************************************************************************************************************
// Copyright � 2014 - 2015 Lahuna. All rights reserved.
// You may not copy, reproduce, republish, disassemble, decompile, reverse engineer, post, broadcast, transmit, or
// make available to the public any content or code on this website without prior written permission from Lahuna.
//*****************************************************************************************************************

'use strict';

/* Services */

var Services = angular.module('Services', ['ngResource']);

// Google Access Token
Services.factory('GoogleAccessTokenResource',
  function ($resource) {
      return $resource(location.origin + ':8000/google/access_token', {}, {
          Post: {
              method: 'POST'
          }
      });
  });

// Google Profile
Services.factory('GoogleProfileResource',
  function ($resource) {
      return function (accessToken) {
          return $resource('https://www.googleapis.com/plus/v1/people/me', {}, {
              Get: {
                  method: 'GET',
                  headers: { "Authorization": "Bearer " + accessToken }
              }
          });
      }
  });

// Lahuna User
Services.factory('UserResource',
  function ($resource) {
      return function (accessToken) {
        return $resource(location.origin + ':8000/user', {}, {
            Get: {
                method: 'GET',
                headers: { "access_token": accessToken }
            },
            Post: {
                method: 'POST',
                headers: { "access_token": accessToken }
            },
        });
      }
  });

//// Update Lahuna User
//Services.factory('UpdateUserResource',
//  function ($resource) {
//      return function (accessToken, refreshToken) {
//          return $resource('todo/user/get-user', {}, {
//              Update: {
//                  method: 'PUT',
//                  headers: {
//                      "AccessToken": accessToken,
//                      "RefreshToken": refreshToken
//                  }
//              }
//          });
//      }
//  });
