//*****************************************************************************************************************
// Copyright � 2014 - 2015 Lahuna. All rights reserved.
// You may not copy, reproduce, republish, disassemble, decompile, reverse engineer, post, broadcast, transmit, or
// make available to the public any content or code on this website without prior written permission from Lahuna.
//*****************************************************************************************************************

'use strict';

var fac = angular.module('AuthenticateFactory', ['ResourceFactory']);

fac.factory('Auth', function (AuthenticateResource) {

  return { 'Authenticate': Authenticate };

  function Authenticate(app, callback) {
    var accessToken = GetAccessToken(app);
    var refreshToken = GetRefreshToken(app);

    if (!accessToken || !refreshToken) {
      return callback();
    }

    AuthenticateResource.Get({
      'accessToken': accessToken,
      'refreshToken': refreshToken
    })
    .$promise.then(function (data) {
      if (data.error) {
        return callback();
      } else {
        StoreValues(data, app);
        return callback(data.displayName);
      }
    }, function (error) {
        return callback();
    });
  }

  function StoreValues(data, app) {
    switch (app) {
      case "foto":
        localStorage.setItem('google_access_token', data.access_token);
        localStorage.setItem('google_user_id', data.user_id);
        localStorage.setItem('google_expires_in', data.expires_in);
        break;

      case "vida":
        localStorage.setItem('youtube_access_token', data.access_token);
        localStorage.setItem('youtube_user_id', data.user_id);
        localStorage.setItem('youtube_expires_in', data.expires_in);
        break;
    }
  }

  function GetAccessToken(app) {
    switch (app) {
      case "foto":
        return localStorage.getItem('google_access_token');
        break;

      case "vida":
        return localStorage.getItem('youtube_access_token');
        break;
    }
  }

  function GetRefreshToken(app) {
    switch (app) {
      case "foto":
        return localStorage.getItem('google_refresh_token');
        break;

      case "vida":
        return localStorage.getItem('youtube_refresh_token');
        break;
    }
  }
});
