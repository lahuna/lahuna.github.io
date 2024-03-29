//*****************************************************************************************************************
// Copyright 2014-2022 Lahuna. All rights reserved.
// You may not copy, reproduce, republish, disassemble, decompile, reverse engineer, post, broadcast, transmit, or
// make available to the public any content or code on this website without prior written permission from Lahuna.
//*****************************************************************************************************************

'use strict';

var ctl = angular.module('MainController', ['ResourceFactory', 'AuthenticateFactory']);

ctl.controller('MainCtrl', function ($scope, $route, Auth, $rootScope) {

  $scope.origin = location.origin;
  //// Authenticate
  Auth.Authenticate('foto', function (result) {
    $rootScope.profile = result;
    $rootScope.showSignIn = !result;
    //$scope.displayName = result;
    //Initialize();
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

  //function GetAccessToken() {
    //return localStorage.getItem('google_access_token');
  //}

  //function Initialize() {
    //GetProfile();

    //if ($route.current.originalPath == '/initial') {
      //Import();
    //}
  //}

  //function GetProfile() {
    //ProfileResource(GetAccessToken()).Get()
      //.$promise.then(function (data) {
          //$scope.profile = data;
    //  });
  //}

  /*function Import() {
    Oboe.get({url: 'https://lahuna.net/picasa/import?accessToken=' + GetAccessToken()}
    ).then(function() {
        // finished loading
    }, function(error) {
        // handle errors
    }, function(node) {
        // handle node data
    });
  }*/
});
