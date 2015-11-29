//*****************************************************************************************************************
// Copyright � 2014 - 2015 Lahuna. All rights reserved.
// You may not copy, reproduce, republish, disassemble, decompile, reverse engineer, post, broadcast, transmit, or
// make available to the public any content or code on this website without prior written permission from Lahuna.
//*****************************************************************************************************************

'use strict';

/* App Module */

var app = angular.module('auth', [
  'ngRoute',
  'ui.bootstrap',
  'Controllers'
]);

app.config(['$routeProvider',
    function ($routeProvider) {

        $routeProvider.
        when('/', {
            templateUrl: 'views/main.html',
            controller: 'MainCtrl'
        }).
        when('/google/state=:state&code=:code', {
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
  }]);
