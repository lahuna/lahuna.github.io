//*****************************************************************************************************************
// Copyright � 2014 - 2016 Lahuna. All rights reserved.
// You may not copy, reproduce, republish, disassemble, decompile, reverse engineer, post, broadcast, transmit, or
// make available to the public any content or code on this website without prior written permission from Lahuna.
//*****************************************************************************************************************

'use strict';

var ctl = angular.module('StripeController', ['ResourceFactory', 'AuthenticateFactory', 'stripe.checkout']);

ctl.controller('StripeCtrl', function ($scope, $route, Auth, $rootScope, StripeCheckoutResource) {

  $rootScope.AppName = 'Stripe';
  $scope.amount = '500';
  $scope.description = 'products';
  $scope.currency = 'usd';

  $scope.origin = location.origin;
  Auth.Authenticate('stripe', function (result) {
    $rootScope.profile = result;
    $rootScope.showSignIn = !result;
  });

  $rootScope.SignIn = function () {
    Auth.SignIn('stripe');
  }

  $rootScope.SignOut = function () {
    Auth.SignOut('stripe');
    $rootScope.profile = null;
    $rootScope.showSignIn = true;
    $route.reload();
  }

  $scope.doCheckout = function(token) {
    StripeCheckoutResource.Post({
      'amount': $scope.amount,
      'currency': $scope.currency,
      'card': token.id
    });
  }




});
