//*****************************************************************************************************************
// Copyright 2014-2018 Lahuna. All rights reserved.
// You may not copy, reproduce, republish, disassemble, decompile, reverse engineer, post, broadcast, transmit, or
// make available to the public any content or code on this website without prior written permission from Lahuna.
//*****************************************************************************************************************

'use strict';

var app = angular.module('player', [
  'ngRoute',
  'ui.bootstrap',
  'Filters',
  'Controllers'
]);

app.config(
    function ($routeProvider, $locationProvider) {
      $locationProvider.html5Mode(false).hashPrefix('');
      $routeProvider.
        when('/:type/:id', {
            templateUrl: 'views/viewer.html',
            controller: 'ViewerCtrl'
        }).
        when('/:type/raw/:id', {
            templateUrl: 'views/raw.html',
            controller: 'ViewerCtrl'
        }).
        otherwise({
            redirectTo: '/'
        });
  });
