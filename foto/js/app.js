//*****************************************************************************************************************
// Copyright � 2014 - 2015 Lahuna. All rights reserved.
// You may not copy, reproduce, republish, disassemble, decompile, reverse engineer, post, broadcast, transmit, or
// make available to the public any content or code on this website without prior written permission from Lahuna.
//*****************************************************************************************************************

'use strict';

/* App Module */

var fotoApp = angular.module('foto', [
  'ngRoute',
  'ngTouch',
  'Controllers',
  'Filters',
  'Services',
  //'Config',
  'ui.bootstrap'
]);

fotoApp.config(
  function ($routeProvider) {
      $routeProvider.
        when('/', {
            templateUrl: 'views/main.html',
            controller: 'MainCtrl'
        }).
        when('/tools', {
            templateUrl: 'views/tools.html',
            controller: 'ToolsCtrl'
        }).
        when('/albums', {
            templateUrl: 'views/albums.html',
            controller: 'AlbumsCtrl'
        }).
        when('/albums/:query', {
            templateUrl: 'views/albums.html',
            controller: 'AlbumsCtrl'
        }).
        when('/albums-type', {
            templateUrl: 'views/albums-type.html',
            controller: 'AlbumTypesCtrl'
        }).
        when('/albums/:type', {
            templateUrl: 'views/albums-year.html',
            controller: 'AlbumsYearCtrl'
        }).
        when('/albums/:type/:year', {
            templateUrl: 'views/albums-month.html',
            controller: 'AlbumsMonthCtrl'
        }).
        when('/albums/:type/:year/:month', {
            templateUrl: 'views/albums-day.html',
            controller: 'AlbumsDayCtrl'
        }).
        when('/albums-other/:type', {
            templateUrl: 'views/albums-other.html',
            controller: 'AlbumsOtherCtrl'
        }).
        when('/dup-albums', {
            templateUrl: 'views/dup-albums.html',
            controller: 'DupAlbumsCtrl'
        }).
        when('/albums-maint', {
            templateUrl: 'views/albums-maint.html',
            controller: 'AlbumsMaintCtrl'
        }).
        when('/tags', {
            templateUrl: 'views/tags.html',
            controller: 'TagsCtrl'
        }).
        when('/tags/:type', {
            templateUrl: 'views/tags.html',
            controller: 'TagsCtrl'
        }).
        when('/album/photos/:albumId', {
            templateUrl: 'views/album-photos.html',
            controller: 'AlbumPhotosCtrl'
        }).
        when('/albums/:type/:year/:month/:day/photos/:albumId/:startIndex/:maxResults/:index', {
            templateUrl: 'views/album-photos-date.html',
            controller: 'AlbumPhotosDateCtrl'
        }).
        when('/tag/photos/:tags', {
            templateUrl: 'views/photos.html',
            controller: 'PhotosCtrl'
        }).
        when('/photos/:query', {
            templateUrl: 'views/photos.html',
            controller: 'PhotosCtrl'
        }).
        when('/photos', {
            templateUrl: 'views/photos.html',
            controller: 'PhotosCtrl'
        }).
        when('/album/create', {
            templateUrl: 'views/edit.html',
            controller: 'CreateAlbumCtrl'
        }).
        when('/album/update/:albumId', {
            templateUrl: 'views/edit.html',
            controller: 'UpdateAlbumCtrl'
        }).
        when('/photo/update/:photoId', {
            templateUrl: 'views/edit.html',
            controller: 'UpdatePhotoCtrl'
        }).
        when('/album/delete/:albumId', {
            templateUrl: 'views/delete.html',
            controller: 'DeleteAlbumCtrl'
        }).
        when('/photo/detail/:photoId', {
            templateUrl: 'views/detail-photo.html',
            controller: 'DetailCtrl'
        }).
        when('/video/detail/:photoId', {
            templateUrl: 'views/detail-video.html',
            controller: 'DetailCtrl'
        }).
        when('/photo/viewer/:photoId', {
            templateUrl: 'views/viewer-photo.html',
            controller: 'ViewerPhotoCtrl'
        }).
        when('/video/viewer/:photoId', {
            templateUrl: 'views/viewer-video.html',
            controller: 'ViewerPhotoCtrl'
        }).
        when('/photos/viewer/:startIndex/:maxResults', {
            templateUrl: 'views/viewer-photos.html',
            controller: 'ViewerPhotosCtrl'
        }).
        when('/photos/viewer/:tag/:startIndex/:maxResults', {
            templateUrl: 'views/viewer-photos.html',
            controller: 'ViewerPhotosCtrl'
        }).
        when('/album/photos/viewer/:albumId/:startIndex/:maxResults', {
            templateUrl: 'views/viewer-photos.html',
            controller: 'ViewerAlbumPhotosCtrl'
        }).
        when('/albums/:type/:year/:month/:day/photos/viewer/:albumId/:startIndex/:maxResults/:index', {
            templateUrl: 'views/viewer-album.html',
            controller: 'ViewerAlbumCtrl'
        }).
        when('/import', {
            templateUrl: 'views/import.html',
            controller: 'ImportCtrl'
        }).
        when('/split', {
            templateUrl: 'views/split.html',
            controller: 'SplitCtrl'
        }).
        otherwise({
            redirectTo: '/'
        });
  });
