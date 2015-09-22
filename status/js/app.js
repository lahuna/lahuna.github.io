//*****************************************************************************************************************
// Copyright © 2014 - 2015 Lahuna. All rights reserved.
// You may not copy, reproduce, republish, disassemble, decompile, reverse engineer, post, broadcast, transmit, or
// make available to the public any content or code on this website without prior written permission from Lahuna.
//*****************************************************************************************************************

'use strict';

/* App Module */

var fotoApp = angular.module('status', [
  'ngRoute',
  'ngTouch',
  'Controllers',
  'Filters',
  'Services',
  'ui.bootstrap'
]);

fotoApp.config(['$routeProvider',
  function ($routeProvider) {
      $routeProvider.
        when('/', {
            templateUrl: 'views/main.html',
            controller: 'MainCtrl'
        }).
        when('/:app', {
            templateUrl: 'views/status.html',
            controller: 'StatusCtrl'
        }).
        when('/errors/:jobId', {
            templateUrl: 'views/errors.html',
            controller: 'ErrorsCtrl'
        }).
        when('/errors/:jobId/:errorIds', {
            templateUrl: 'views/errors-list.html',
            controller: 'ErrorsListCtrl'
        }).
        when('/error-detail/:errorId', {
            templateUrl: 'views/error-detail.html',
            controller: 'ErrorDetailCtrl'
        }).
        otherwise({
            redirectTo: '/'
        });
  }]);