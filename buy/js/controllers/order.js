//*****************************************************************************************************************
// Copyright 2014-2022 Lahuna. All rights reserved.
// You may not copy, reproduce, republish, disassemble, decompile, reverse engineer, post, broadcast, transmit, or
// make available to the public any content or code on this website without prior written permission from Lahuna.
//*****************************************************************************************************************

'use strict';

var ctl = angular.module('OrderController', ['ResourceFactory', 'AuthenticateFactory']);

ctl.controller('OrderCtrl', function ($scope, $route, Auth, $rootScope,
  $routeParams, OrderResource) {

  $scope.origin = location.origin;
  Auth.Authenticate('buy', function (result) {
    $rootScope.profile = result;
    $rootScope.showSignIn = !result;
    Initialize();
  });

  $rootScope.SignIn = function () {
    Auth.SignIn('buy');
  }

  $rootScope.SignOut = function () {
    Auth.SignOut('buy');
    $rootScope.profile = null;
    $rootScope.showSignIn = true;
    $route.reload();
  }

  function GetAccessToken() {
    return localStorage.getItem('google_access_token');
  }

  function Initialize() {
    $scope.order = OrderResource.Get({
      '_id': $routeParams.orderId,
      'accessToken': GetAccessToken()
    });
  }

});
