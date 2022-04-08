//*****************************************************************************************************************
// Copyright 2014-2022 Lahuna. All rights reserved.
// You may not copy, reproduce, republish, disassemble, decompile, reverse engineer, post, broadcast, transmit, or
// make available to the public any content or code on this website without prior written permission from Lahuna.
//*****************************************************************************************************************

'use strict';

var ctl = angular.module('StripeController', ['ResourceFactory', 'AuthenticateFactory']);

ctl.controller('StripeCtrl', function ($scope, $route, Auth, $rootScope, $routeParams,
  StripeAccessTokenResource, StripeMerchantResource) {

  $scope.origin = location.origin;
  Auth.Authenticate('sell', function (result) {
    $rootScope.profile = result;
    $rootScope.showSignIn = !result;
    if (result) {
      Initialize(result.id);
    }
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

  function Initialize(userId) {
    if ($routeParams.code) {
      StripeAccessTokenResource.Post({
        'user_id': userId,
        'code': $routeParams.code
      }).$promise.then(function (data) {
        GetMerchant(userId);
      });
    } else {
      GetMerchant(userId);
    }
  }

  function GetMerchant(userId) {
    StripeMerchantResource.Get({
      'user_id': userId
    }).$promise.then(function (data) {
      if (data.id) {
        $scope.info = data;
      } else {
        $scope.signup = true;
      }
    });
  }









});
