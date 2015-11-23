//*****************************************************************************************************************
// Copyright � 2014 - 2015 Lahuna. All rights reserved.
// You may not copy, reproduce, republish, disassemble, decompile, reverse engineer, post, broadcast, transmit, or
// make available to the public any content or code on this website without prior written permission from Lahuna.
//*****************************************************************************************************************

'use strict';

var ctl = angular.module('MainController', ['ResourceFactory', 'AuthenticateFactory']);

ctl.controller('MainCtrl', function ($scope, $routeParams, $route, Auth,
  ProfileResource, ImportPlaylistResource, ImportPlaylistItemResource) {

  $scope.needSignIn = false;
  Auth.authenticate(function (result) {
    $scope.needSignIn = result;
    Initialize();
  });

  function Initialize() {
    GetProfile();

    if ($route.current.originalPath == '/initial')
        Import();
  }

  function GetProfile() {
    ProfileResource(Auth.getAccessToken()).Get()
        .$promise.then(function (data) {
            $scope.profile = data;
        });
  }

  function Import() {

    ImportPlaylistResource.Post({
        job: 'true',
        accessToken: Auth.getAccessToken()
    }).$promise.then(function () {
        ImportPlaylistItemResource.Post({
          accessToken: Auth.getAccessToken()
        });
    });
  }
});
