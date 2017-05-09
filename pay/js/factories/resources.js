//*****************************************************************************************************************
// Copyright 2014 - 2017 Lahuna. All rights reserved.
// You may not copy, reproduce, republish, disassemble, decompile, reverse engineer, post, broadcast, transmit, or
// make available to the public any content or code on this website without prior written permission from Lahuna.
//*****************************************************************************************************************

'use strict';

var fac = angular.module('ResourceFactory', ['ngResource']);

fac.factory('AuthenticateResource', function ($resource) {
  return $resource('https://lahuna.net/google/authenticate', {}, {
    Get: {
      method: 'GET'
    }
  });
});

fac.factory('BraintreeClientTokenResource', function ($resource) {
  return $resource('https://lahuna.net/braintree/client_token', {}, {
    Get: {
      method: 'GET'
    }
  });
});

fac.factory('BraintreeCheckoutResource', function ($resource) {
  return $resource('https://lahuna.net/braintree/checkout', {}, {
    Post: {
      method: 'POST'
    }
  });
});

fac.factory('BraintreeOnboardResource', function ($resource) {
  return $resource('https://lahuna.net/braintree/onboard', {}, {
    Post: {
      method: 'POST'
    }
  });
});

fac.factory('PaymentResource', function ($resource) {
  return $resource('https://api.sandbox.paypal.com/v1/payments/payment', {}, {
    Post: {
      method: 'POST'
    }
  });
});
