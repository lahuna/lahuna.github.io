//*****************************************************************************************************************
// Copyright � 2014 - 2015 Lahuna. All rights reserved.
// You may not copy, reproduce, republish, disassemble, decompile, reverse engineer, post, broadcast, transmit, or
// make available to the public any content or code on this website without prior written permission from Lahuna.
//*****************************************************************************************************************

'use strict';

var fac = angular.module('AuthenticateFactory', ['ResourceFactory']);

fac.factory('Auth', function (AuthenticateResource) {

  return { 'authenticate': authenticate,
           'getAccessToken': getAccessToken };

  function authenticate(callback) {
    AuthenticateResource.Get({
      accessToken: getAccessToken(),
      refreshToken: getRefreshToken()
    })
    .$promise.then(function (data) {
        // TODO: test whether or not valid accessToken returned
        // or some kind of error
        storeValues(data);
        return callback(false);
    }, function (error) {
        return callback(true);
    });
  }

  function storeValues(data) {
    localStorage.setItem('youtube_access_token', data.access_token);
    localStorage.setItem('youtube_user_id', data.user_id);
    localStorage.setItem('youtube_expires_in', data.expires_in);
  }

  function getAccessToken() {
    return localStorage.getItem('youtube_access_token');
  }

  function getRefreshToken() {
    return localStorage.getItem('youtube_refresh_token');
  }
});
