//*****************************************************************************************************************
// Copyright � 2014 - 2016 Lahuna. All rights reserved.
// You may not copy, reproduce, republish, disassemble, decompile, reverse engineer, post, broadcast, transmit, or
// make available to the public any content or code on this website without prior written permission from Lahuna.
//*****************************************************************************************************************

'use strict';

var ctl = angular.module('MainController', ['ResourceFactory', 'AuthenticateFactory']);

ctl.controller('MainCtrl', function ($scope, $route, Auth, $rootScope, PaymentResource) {

  $rootScope.AppName = 'Pay';
  $scope.NavPath = 'views/app.html';

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

  /*$scope.pay = function () {
    PaymentResource.Post({
      "intent": "sale",
      "payer": {
        "payment_method": "credit_card",
        "funding_instruments": [
          {
            "credit_card": {
              "number": "5500005555555559",
              "type": "mastercard",
              "expire_month": 12,
              "expire_year": 2018,
              "cvv2": 111,
              "first_name": "Betsy",
              "last_name": "Buyer"
            }
          }
        ]
      },
      "transactions": [
        {
          "amount": {
            "total": "7.47",
            "currency": "USD"
          },
          "description": "This is the payment transaction description."
        }
      ]
    }).$promise.then(function (data) {
      $scope.data = data;
    });
  }*/
});
