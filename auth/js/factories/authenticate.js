//*****************************************************************************************************************
// Copyright � 2014 - 2016 Lahuna. All rights reserved.
// You may not copy, reproduce, republish, disassemble, decompile, reverse engineer, post, broadcast, transmit, or
// make available to the public any content or code on this website without prior written permission from Lahuna.
//*****************************************************************************************************************

'use strict';

var fac = angular.module('AuthenticateFactory', ['AuthResourceFactory']);

fac.factory('Auth', function (AuthenticateResource) {

  return { 'Authenticate': Authenticate,
           'SignIn': SignIn,
           'SignOut': SignOut,
           'Store': Store };

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
        return callback(data.profile);
      }
    }, function (error) {
        return callback();
    });
  }

  function StoreValues(data, app) {
    switch (app) {
      case "order":
      case "foto":
        Store('google_access_token', data.access_token);
        Store('google_user_id', data.user_id);
        Store('google_expires_in', data.expires_in);
        break;

      case "vida":
        Store('youtube_access_token', data.access_token);
        Store('youtube_user_id', data.user_id);
        Store('youtube_expires_in', data.expires_in);
        break;

      case "blitz":
        Store('blogger_access_token', data.access_token);
        Store('blogger_use_id', data.user_id);
        Store('blogger_expires_in', data.expires_in);
        break;
    }
  }

  function SignIn(app) {
    var scope;
    switch (app) {
      case "order":
      case "foto":
        scope = "https://picasaweb.google.com/data";
        break;

      case "vida":
        scope = "https://www.googleapis.com/auth/youtube";
        break;

      case "blitz":
        scope = "https://www.googleapis.com/auth/blogger";
        break;
    }

    localStorage.setItem('auth_redirect', location.href);

    location.href =
    "https://accounts.google.com/o/oauth2/auth?" +
    "response_type=code&" +
    "access_type=offline&" +
    "client_id=206181221643-0vs27daoo6pnl5bbc8i9djnaiv9umqmb.apps.googleusercontent.com&" +
    "redirect_uri=" + location.origin + "/auth/google&" +
    "scope=profile email " + scope + "&" +
    "state=" + app + "&" +
    "approval_prompt=force";
  }

  function SignOut(app) {
    switch (app) {
      case "order":
      case "foto":
        localStorage.removeItem('google_access_token');
        localStorage.removeItem('google_refresh_token');
        localStorage.removeItem('google_user_id');
        localStorage.removeItem('google_expires_in');
        break;

      case "vida":
        localStorage.removeItem('youtube_access_token');
        localStorage.removeItem('youtube_refresh_token');
        localStorage.removeItem('youtube_user_id');
        localStorage.removeItem('youtube_expires_in');
        break;

      case "blitz":
        localStorage.removeItem('blogger_access_token');
        localStorage.removeItem('blogger_refresh_token');
        localStorage.removeItem('blogger_user_id');
        localStorage.removeItem('blogger_expires_in');
        break;
    }
  }

  function Store(key, value) {
    if (!value) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, value);
    }
  }

  function GetAccessToken(app) {
    switch (app) {
      case "order":
      case "foto":
        return localStorage.getItem('google_access_token');
        break;

      case "vida":
        return localStorage.getItem('youtube_access_token');
        break;

      case "blitz":
        return localStorage.getItem('blogger_access_token');
        break;
    }
  }

  function GetRefreshToken(app) {
    switch (app) {
      case "order":
      case "foto":
        return localStorage.getItem('google_refresh_token');
        break;

      case "vida":
        return localStorage.getItem('youtube_refresh_token');
        break;

      case "blitz":
        return localStorage.getItem('blogger_refresh_token');
        break;
    }
  }
});
