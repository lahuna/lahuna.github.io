//*****************************************************************************************************************
// Copyright © 2014 - 2015 Lahuna. All rights reserved.
// You may not copy, reproduce, republish, disassemble, decompile, reverse engineer, post, broadcast, transmit, or
// make available to the public any content or code on this website without prior written permission from Lahuna.
//*****************************************************************************************************************

'use strict';

/* Services */

var Services = angular.module('Services', ['ngResource']);

// Google Access Token
Services.factory('GoogleAccessTokenResource',
  function ($resource) {
      return $resource('/api/google/get-access-token', {}, {
          Get: {
              method: 'GET'
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

// Get Lahuna User
Services.factory('GetUserResource',
    function ($resource) {
        return $resource('/api/user/get-user', {}, {
            Get: {
                method: 'GET'
            }
        });
    });

// Create Lahuna User
Services.factory('CreateUserResource',
    function ($resource) {
        return $resource('/api/user/create-user', {}, {
            Create: {
                method: 'GET'
            }
        });
    });

//// Update Lahuna User
//Services.factory('UpdateUserResource',
//  function ($resource) {
//      return function (accessToken, refreshToken) {
//          return $resource('/api/user/get-user', {}, {
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