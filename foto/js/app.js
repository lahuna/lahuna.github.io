//*****************************************************************************************************************
// Copyright 2014-2022 Lahuna. All rights reserved.
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
  'DetailController',
  'EditAlbumController',
  'EditPhotoController',
  'TagsController',
  'ToolsController',
  'ProfileController'
]);

app.config(
    function ($routeProvider, $locationProvider) {
        $locationProvider.html5Mode(false).hashPrefix('');
        $routeProvider.
        when('/', {
            templateUrl: 'views/main.html',
            controller: 'MainCtrl'
        }).
        //when('/initial', {
            //templateUrl: 'views/main.html',
            //controller: 'MainCtrl'
        //}).
        when('/profile', {
            templateUrl: '/auth/views/profile.html',
            controller: 'ProfileCtrl'
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
        when('/photos/album/:albumId', {
            templateUrl: 'views/photos.html',
            controller: 'PhotosCtrl'
        }).
        /*when('/album/photos/viewer/:albumId/:startIndex/:maxResults', {
            templateUrl: 'views/viewer-photos.html',
            controller: 'ViewerCtrl'
        }).
        when('/photos/viewer/:tag/:startIndex/:maxResults', {
            templateUrl: 'views/viewer-photos.html',
            controller: 'ViewerCtrl'
        }).
        when('/photos/viewer/:startIndex/:maxResults', {
            templateUrl: 'views/viewer-photos.html',
            controller: 'ViewerCtrl'
        }).*/
        when('/viewer/:index', {
            templateUrl: 'views/viewer.html',
            controller: 'ViewerCtrl'
        }).
        /*when('/video/viewer/:photoId', {
            templateUrl: 'views/viewer-video.html',
            controller: 'ViewerCtrl'
        }).*/
        when('/album/edit/', {
            templateUrl: 'views/edit-album.html',
            controller: 'EditAlbumCtrl'
        }).
        when('/album/edit/:albumId', {
            templateUrl: 'views/edit-album.html',
            controller: 'EditAlbumCtrl'
        }).
        when('/photo/edit/:photoId', {
            templateUrl: 'views/edit-photo.html',
            controller: 'EditPhotoCtrl'
        }).
        when('/album/raw/:albumId', {
            templateUrl: 'views/raw.html',
            controller: 'DetailCtrl'
        }).
        when('/photo/raw/:photoId', {
            templateUrl: 'views/raw.html',
            controller: 'DetailCtrl'
        }).
        when('/album/detail/:albumId', {
            templateUrl: 'views/detail-album.html',
            controller: 'DetailCtrl'
        }).
        when('/photo/detail/:photoId', {
            templateUrl: 'views/detail-photo.html',
            controller: 'DetailCtrl'
        }).
        when('/video/detail/:photoId', {
            templateUrl: 'views/detail-video.html',
            controller: 'DetailCtrl'
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
