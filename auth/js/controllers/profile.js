//*****************************************************************************************************************
// Copyright � 2014 - 2015 Lahuna. All rights reserved.
// You may not copy, reproduce, republish, disassemble, decompile, reverse engineer, post, broadcast, transmit, or
// make available to the public any content or code on this website without prior written permission from Lahuna.
//*****************************************************************************************************************

'use strict';

var ctl = angular.module('ProfileController', ['AuthResourceFactory', 'AuthenticateFactory']);

ctl.controller('ProfileCtrl', function ($scope, $routeParams, Auth, GoogleProfileResource) {
  //$scope.app = $routParams.app;
  alert(GetAccessToken());
  $scope.profile = GoogleProfileResource(GetAccessToken()).Get();

  function GetAccessToken(app) {
    var app = GetApp();
    switch (app) {
        case "foto":
            return localStorage.getItem("google_access_token");
            break;

        case "vida":
            return localStorage.getItem("youtube_access_token");
            break;

        case "blitz":
            return localStorage.getItem("blogger_access_token");
            break;
    }
  }

  function GetApp() {
    if (location.href.indexOf('foto')) {
      return 'foto';
    } else if (location.href.indexOf('vida')) {
      return 'vida';
    } else if (location.href.indexOf('blitz')) {
      return 'blitz';
    }
  }
});
