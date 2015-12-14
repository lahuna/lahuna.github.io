//*****************************************************************************************************************
// Copyright � 2014 - 2015 Lahuna. All rights reserved.
// You may not copy, reproduce, republish, disassemble, decompile, reverse engineer, post, broadcast, transmit, or
// make available to the public any content or code on this website without prior written permission from Lahuna.
//*****************************************************************************************************************

'use strict';

var ctl = angular.module('DetailController', ['ResourceFactory', 'AuthenticateFactory']);

ctl.controller('DetailCtrl',
  function ($scope, $routeParams, PicasaAlbumResource, PicasaPhotoResource, Auth) {

  $scope.needSignIn = false;
  Auth.Authenticate('foto', function (result) {
    $scope.needSignIn = result;
    Initialize();
  });

  function GetAccessToken() {
    return localStorage.getItem('google_access_token');
  }

  //****************************************
  // INITIALIZE
  //****************************************

  function Initialize() {
    PicasaPhotoResource($routeParams.photoId).Get({
      'alt': 'json',
      'accessToken': GetAccessToken()
    }).$promise.then(function (data) {
      $scope.photo = data.entry;
      GetAlbum(data.entry.gphoto$albumid.$t)
    });
  }

  function GetAlbum(albumId) {
    PicasaAlbumResource(albumId).Get({
      'alt': 'json',
      'accessToken': GetAccessToken()
    }).$promise.then(function (data) {
      $scope.album = data.entry;
    });
  }
});
