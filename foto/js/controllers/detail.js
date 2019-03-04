//*****************************************************************************************************************
// Copyright 2014-2019 Lahuna. All rights reserved.
// You may not copy, reproduce, republish, disassemble, decompile, reverse engineer, post, broadcast, transmit, or
// make available to the public any content or code on this website without prior written permission from Lahuna.
//*****************************************************************************************************************

'use strict';

var ctl = angular.module('DetailController', ['ResourceFactory', 'AuthenticateFactory']);

ctl.controller('DetailCtrl',
  function ($scope, $routeParams, PicasaAlbumResource,
    PicasaPhotoResource, Auth, $route, $rootScope) {

  // Authenticate
  Auth.Authenticate('foto', function (result) {
    $scope.displayName = result;
    Initialize();
  });

  $rootScope.SignIn = function () {
    Auth.SignIn('foto');
  }

  $rootScope.SignOut = function () {
    Auth.SignOut('foto');
    $rootScope.profile = null;
    $rootScope.showSignIn = true;
    $route.reload();
  }

  function GetAccessToken() {
    return localStorage.getItem('google_access_token');
  }

  //****************************************
  // INITIALIZE
  //****************************************

  function Initialize() {
    if ($routeParams.albumId) {
      GetAlbum($routeParams.albumId);
    } else if ($routeParams.photoId) {
      GetPhoto($routeParams.photoId);
    }
  }

  function GetPhoto(photoId) {
    PicasaPhotoResource(photoId).Get({
      'accessToken': GetAccessToken()
    }).$promise.then(function (data) {
      $scope.photo = data.entry;
      $scope.raw = data;
      GetAlbum(data.entry.gphoto$albumid.$t)
    });
  }

  function GetAlbum(albumId) {
    PicasaAlbumResource(albumId).Get({
      'accessToken': GetAccessToken()
    }).$promise.then(function (data) {
      $scope.album = data.entry;
      if (!$scope.raw) {
        $scope.raw = data;
      }
    });
  }
});
