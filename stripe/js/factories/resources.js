//*****************************************************************************************************************
// Copyright 2014-2022 Lahuna. All rights reserved.
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

fac.factory('StripeCheckoutResource', function ($resource) {
  return $resource('https://lahuna.net/stripe/checkout', {}, {
    Post: {
      method: 'POST'
    }
  });
});
