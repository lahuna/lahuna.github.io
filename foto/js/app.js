//*****************************************************************************************************************
// Copyright � 2014 - 2015 Lahuna. All rights reserved.
// You may not copy, reproduce, republish, disassemble, decompile, reverse engineer, post, broadcast, transmit, or
// make available to the public any content or code on this website without prior written permission from Lahuna.
//*****************************************************************************************************************

'use strict';

var app = angular.module('foto', [
  'ngRoute',
  'ui.bootstrap',
  'ngTouch',
  'Filters',
  'MainController',
  'AlbumsController',
  'PhotosController',
  'TagsController',
  'ToolsController'
]);

app.config(
  function ($routeProvider) {
      $routeProvider.
        when('/', {
            templateUrl: 'views/main.html',
            controller: 'MainCtrl'
        }).
        when('/photos', {
            templateUrl: 'views/photos.html',
            controller: 'PhotosCtrl'
        }).
        when('/albums', {
            templateUrl: 'views/albums.html',
            controller: 'AlbumsCtrl'
        }).
        when('/tags/:type', {
            templateUrl: 'views/tags.html',
            controller: 'TagsCtrl'
        }).
        when('/tools', {
            templateUrl: 'views/tools.html',
            controller: 'ToolsCtrl'
        }).
        otherwise({
            redirectTo: '/'
        });
  });
