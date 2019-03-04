//*****************************************************************************************************************
// Copyright 2014-2019 Lahuna. All rights reserved.
// You may not copy, reproduce, republish, disassemble, decompile, reverse engineer, post, broadcast, transmit, or
// make available to the public any content or code on this website without prior written permission from Lahuna.
//*****************************************************************************************************************

'use strict';

var app = angular.module('auth', [
  'ngRoute',
  'ui.bootstrap',
  'AgreeController',
  'GoogleController',
  'MainController'
]);

app.config(
    function ($routeProvider, $locationProvider) {
        $locationProvider.html5Mode(false).hashPrefix('');
        $routeProvider.
        when('/', {
            templateUrl: 'views/main.html',
            controller: 'MainCtrl'
        }).
        when('/google/:state', { ///state=:state&code=:code
            templateUrl: 'views/main.html',
            controller: 'GoogleCtrl'
        }).
        when('/agree/:state', {
            templateUrl: 'views/agree.html',
            controller: 'AgreeCtrl'
        }).
        otherwise({
            redirectTo: '/'
        });
  });
