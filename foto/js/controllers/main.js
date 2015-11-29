//*****************************************************************************************************************
// Copyright � 2014 - 2015 Lahuna. All rights reserved.
// You may not copy, reproduce, republish, disassemble, decompile, reverse engineer, post, broadcast, transmit, or
// make available to the public any content or code on this website without prior written permission from Lahuna.
//*****************************************************************************************************************

'use strict';

var ctl = angular.module('MainController', ['ResourceFactory', 'AuthenticateFactory']);

ctl.controller('MainCtrl', function ($scope, ProfileResource, Auth) {

  $scope.origin = location.origin;
  $scope.needSignIn = false;
  Auth.Authenticate('foto', function (result) {
    $scope.needSignIn = result;
    GetProfile();
  });

  function GetAccessToken() {
    return localStorage.getItem('google_access_token');
  }

  function GetProfile() {
    ProfileResource(GetAccessToken()).Get()
      .$promise.then(function (data) {
          $scope.profile = data;
      });
  }
});
