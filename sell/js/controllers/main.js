//*****************************************************************************************************************
// Copyright 2014-2019 Lahuna. All rights reserved.
// You may not copy, reproduce, republish, disassemble, decompile, reverse engineer, post, broadcast, transmit, or
// make available to the public any content or code on this website without prior written permission from Lahuna.
//*****************************************************************************************************************

'use strict';

var ctl = angular.module('MainController', ['ResourceFactory', 'AuthenticateFactory']);

ctl.controller('MainCtrl', function ($scope, $route, Auth, $rootScope) {

  $scope.origin = location.origin;
  Auth.Authenticate('sell', function (result) {
    $rootScope.profile = result;
    $rootScope.showSignIn = !result;
  });

  $rootScope.SignIn = function () {
    Auth.SignIn('sell');
  }

  $rootScope.SignOut = function () {
    Auth.SignOut('sell');
    $rootScope.profile = null;
    $rootScope.showSignIn = true;
    $route.reload();
  }
});
