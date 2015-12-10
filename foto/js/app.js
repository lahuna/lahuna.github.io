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
  'ModalInstanceController',
  'AlbumsController',
  'AlbumPhotosController',
  'PhotosController',
  'ViewerController',
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
        when('/initial', {
            templateUrl: 'views/main.html',
            controller: 'MainCtrl'
        }).
        when('/photos', {
            templateUrl: 'views/photos.html',
            controller: 'PhotosCtrl'
        }).
        when('/photos/:query', {
            templateUrl: 'views/photos.html',
            controller: 'PhotosCtrl'
        }).
        when('/albums', {
            templateUrl: 'views/albums.html',
            controller: 'AlbumsCtrl'
        }).
        when('/albums/:query', {
            templateUrl: 'views/albums.html',
            controller: 'AlbumsCtrl'
        }).
        when('/album/photos/:albumId', {
            templateUrl: 'views/album-photos.html',
            controller: 'AlbumPhotosCtrl'
        }).
        when('/album/photos/viewer/:albumId/:startIndex/:maxResults', {
            templateUrl: 'views/viewer-photos.html',
            controller: 'ViewerCtrl'
        }).
        when('/photos/viewer/:tag/:startIndex/:maxResults', {
            templateUrl: 'views/viewer-photos.html',
            controller: 'ViewerCtrl'
        }).
        when('/photo/viewer/:photoId', {
            templateUrl: 'views/viewer-photo.html',
            controller: 'ViewerCtrl'
        }).
        when('/video/viewer/:photoId', {
            templateUrl: 'views/viewer-video.html',
            controller: 'ViewerCtrl'
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
