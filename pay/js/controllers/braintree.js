//*****************************************************************************************************************
// Copyright 2014 - 2017 Lahuna. All rights reserved.
// You may not copy, reproduce, republish, disassemble, decompile, reverse engineer, post, broadcast, transmit, or
// make available to the public any content or code on this website without prior written permission from Lahuna.
//*****************************************************************************************************************

'use strict';

var ctl = angular.module('BraintreeController', ['ResourceFactory', 'AuthenticateFactory']);

ctl.controller('BraintreeCtrl', function ($scope, $route, Auth, $rootScope,
BraintreeClientTokenResource, BraintreeCheckoutResource, BraintreeOnboardResource) {

  $scope.origin = location.origin;
  Auth.Authenticate('pay', function (result) {
    $rootScope.profile = result;
    $rootScope.showSignIn = !result;
    Initialize();
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

  function Initialize() {
    BraintreeClientTokenResource.Get()
    .$promise.then(function (data) {
      braintree.setup(data.clientToken, "dropin", {
        container: "payment-form",
        paymentMethodNonceReceived: function (event, nonce) {
          Checkout(nonce);
        }
      });
    });
  }

  function Checkout(nonce) {
    BraintreeCheckoutResource.Post({
      amount: '10.00',
      paymentMethodNonce: nonce,
      merchantAccountId: "blue_ladders_store",
      serviceFeeAmount: "1.00",
      options: {
        submitForSettlement: true
      }
    }).$promise.then(function (data) {
      window.alert('Checkout completed');
    });
  }

  $scope.Onboard = function () {
    var data = {
      individual: {
        firstName: "Jane",
        lastName: "Doe",
        email: "jane@14ladders.com",
        phone: "5553334444",
        dateOfBirth: "1981-11-19",
        /*ssn: "456-45-4567",*/
        address: {
          streetAddress: "111 Main St",
          locality: "Chicago",
          region: "IL",
          postalCode: "60622"
        }
      },
      /*business: {
        legalName: "Jane's Ladders",
        dbaName: "Jane's Ladders",
        taxId: "98-7654321",
        address: {
          streetAddress: "111 Main St",
          locality: "Chicago",
          region: "IL",
          postalCode: "60622"
        }
      },*/
      funding: {
        /*descriptor: "Blue Ladders",*/
        destination: "bank",
        /*email: "funding@blueladders.com",
        mobilePhone: "5555555555",*/
        accountNumber: "1123581321",
        routingNumber: "071101307"
      },
      tosAccepted: true,
      masterMerchantAccountId: "lahuna",
      id: "lahuna_customer_2"
    };

    BraintreeOnboardResource.Post(data)
    .$promise.then(function (data) {
      window.alert('Onboard completed');
    });
  }

});
