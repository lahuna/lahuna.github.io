//*****************************************************************************************************************
// Copyright � 2014 - 2015 Lahuna. All rights reserved.
// You may not copy, reproduce, republish, disassemble, decompile, reverse engineer, post, broadcast, transmit, or
// make available to the public any content or code on this website without prior written permission from Lahuna.
//*****************************************************************************************************************

'use strict';

var ctl = angular.module('AlbumPhotosController', ['ResourceFactory', 'AuthenticateFactory']);

ctl.controller('AlbumPhotosCtrl', function ($scope, $routeParams,
  PicasaAlbumFeedResource, Auth) {

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
        $scope.startIndex = 1;
        $scope.maxResults = 10;
        $scope.albumId = $routeParams.albumId;

        $scope.list = PicasaAlbumFeedResource($routeParams.albumId).Get({
            'kind': 'photo',
            'start-index': $scope.startIndex,
            'max-results': $scope.maxResults,
            'alt': 'json',
            accessToken: GetAccessToken()
        });
    }

    $scope.StoreId = function (photoId) {
        localStorage.setItem('fotoId', photoId);
    }
});