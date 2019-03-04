//*****************************************************************************************************************
// Copyright 2014-2019 Lahuna. All rights reserved.
// You may not copy, reproduce, republish, disassemble, decompile, reverse engineer, post, broadcast, transmit, or
// make available to the public any content or code on this website without prior written permission from Lahuna.
//*****************************************************************************************************************

'use strict';

var ctl = angular.module('StripeController', ['ResourceFactory', 'AuthenticateFactory']);

ctl.controller('StripeCtrl', function ($scope, $route, Auth, $rootScope, PaymentResource) {

  $rootScope.AppName = 'Pay';

  $scope.origin = location.origin;
  Auth.Authenticate('pay', function (result) {
    $rootScope.profile = result;
    $rootScope.showSignIn = !result;
  });

  $rootScope.SignIn = function () {
    Auth.SignIn('pay');
  }

  $rootScope.SignOut = function () {
    Auth.SignOut('pay');
    $rootScope.profile = null;
    $rootScope.showSignIn = true;
    $route.reload();
  }
});
