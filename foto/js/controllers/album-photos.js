//*****************************************************************************************************************
// Copyright � 2014 - 2016 Lahuna. All rights reserved.
// You may not copy, reproduce, republish, disassemble, decompile, reverse engineer, post, broadcast, transmit, or
// make available to the public any content or code on this website without prior written permission from Lahuna.
//*****************************************************************************************************************

'use strict';

var ctl = angular.module('AlbumPhotosController', ['ResourceFactory', 'AuthenticateFactory']);

ctl.controller('AlbumPhotosCtrl', function ($scope, $routeParams,
  PicasaAlbumFeedResource, Auth, $route, $rootScope) {

    Auth.Authenticate('foto', function (result) {
      $rootScope.profile = result;
      $rootScope.showSignIn = !result;
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
        $scope.startIndex = 1;
        $scope.maxResults = 10;
        $scope.albumId = $routeParams.albumId;

        $scope.list = PicasaAlbumFeedResource($routeParams.albumId).Get({
            'kind': 'photo',
            'start-index': $scope.startIndex,
            'max-results': $scope.maxResults,
            //'alt': 'json',
            accessToken: GetAccessToken()
        });
    }

    $scope.StoreId = function (photoId) {
        Auth.Store('fotoId', photoId);
    }
});
