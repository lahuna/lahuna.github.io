//*****************************************************************************************************************
// Copyright 2014-2022 Lahuna. All rights reserved.
// You may not copy, reproduce, republish, disassemble, decompile, reverse engineer, post, broadcast, transmit, or
// make available to the public any content or code on this website without prior written permission from Lahuna.
//*****************************************************************************************************************

'use strict';

var ctl = angular.module('ProfileController', ['ResourceFactory', 'AuthenticateFactory']);

ctl.controller('ProfileCtrl', function ($scope, $routeParams, $rootScope,
  Auth, $route) {

  $scope.app = GetApp();

  Auth.Authenticate($scope.app, function (result) {
    $rootScope.profile = result;
    $rootScope.showSignIn = !result;
    if (result) {
      $scope.image = result.image.url.replace('sz=50', 'sz=150');
      $scope.raw = JSON.stringify(result, null, '\t');
    }
  });

  $rootScope.SignIn = function () {
    Auth.SignIn($scope.app);
  }

  $rootScope.SignOut = function () {
    Auth.SignOut($scope.app);
    $rootScope.profile = null;
    $rootScope.showSignIn = true;
    $route.reload();
  }

  /*function GetProfile() {
    GoogleProfileResource(GetAccessToken()).Get()
    .$promise.then(function (data) {
      $scope.profile = data;
      $scope.image = data.image.url.replace('sz=50', 'sz=150');
      $scope.raw = JSON.stringify(data, null, '\t');
    });
  }

  function GetAccessToken() {
    switch ($scope.app) {
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
  }*/

  function GetApp() {
    if (location.href.indexOf('foto') > -1) {
      return 'foto';
    } else if (location.href.indexOf('vida') > -1) {
      return 'vida';
    } else if (location.href.indexOf('blitz') > -1) {
      return 'blitz';
    } else if (location.href.indexOf('buy') > -1) {
      return 'buy';
    } else if (location.href.indexOf('sell') > -1) {
      return 'sell';
    } else if (location.href.indexOf('pay') > -1) {
      return 'pay';
    }
  }

  $scope.showRaw = function () {
    $scope.rawVisible = !$scope.rawVisible;
  }

});
