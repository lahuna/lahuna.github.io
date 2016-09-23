//*****************************************************************************************************************
// Copyright � 2014 - 2016 Lahuna. All rights reserved.
// You may not copy, reproduce, republish, disassemble, decompile, reverse engineer, post, broadcast, transmit, or
// make available to the public any content or code on this website without prior written permission from Lahuna.
//*****************************************************************************************************************

'use strict';

var app = angular.module('stripe', [
  'ngRoute',
  'ui.bootstrap',
  'Filters',
  'ProfileController',
  'StripeController'
]);

app.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.
            when('/', {
              templateUrl: 'views/stripe.html',
              controller: 'StripeCtrl'
            }).
            otherwise({
              redirectTo: '/'
            });
  }]);