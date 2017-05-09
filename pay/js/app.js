//*****************************************************************************************************************
// Copyright 2014 - 2017 Lahuna. All rights reserved.
// You may not copy, reproduce, republish, disassemble, decompile, reverse engineer, post, broadcast, transmit, or
// make available to the public any content or code on this website without prior written permission from Lahuna.
//*****************************************************************************************************************

'use strict';

var app = angular.module('pay', [
  'ngRoute',
  'ui.bootstrap',
  'Filters',
  'MainController',
  'ProfileController',
  'BraintreeController',
  'StripeController'
]);

app.config(
    function ($routeProvider, $locationProvider) {
        $locationProvider.html5Mode(false).hashPrefix('');
        $routeProvider.
            when('/', {
                templateUrl: 'views/main.html',
                controller: 'MainCtrl'
            }).
            when('/stripe', {
                templateUrl: 'views/stripe.html',
                controller: 'StripeCtrl'
            }).
            when('/brain', {
                templateUrl: 'views/brain.html',
                controller: 'BraintreeCtrl'
            }).
            when('/profile', {
                templateUrl: '/auth/views/profile.html',
                controller: 'ProfileCtrl'
            }).
            otherwise({
                redirectTo: '/'
            });
  });
