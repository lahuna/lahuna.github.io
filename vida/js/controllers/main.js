//*****************************************************************************************************************
// Copyright � 2014 - 2015 Lahuna. All rights reserved.
// You may not copy, reproduce, republish, disassemble, decompile, reverse engineer, post, broadcast, transmit, or
// make available to the public any content or code on this website without prior written permission from Lahuna.
//*****************************************************************************************************************

'use strict';

var ctl = angular.module('MainController', ['ResourceFactory', 'AuthenticateFactory']);

ctl.controller('MainCtrl', function ($scope, $rootScope, $routeParams, $route, Auth) {

  $scope.origin = location.origin;

  Auth.Authenticate('vida', function (result) {
    $scope.displayName = result;
    $rootScope.displayName = result;
    //Initialize();
  });

  //function GetAccessToken() {
    //return localStorage.getItem('youtube_access_token');
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
      //});
  //}

  /*function Import() {
    Oboe.get({url: location.origin + ':8080/youtube/import?accessToken=' + GetAccessToken()}
    ).then(function() {
        // finished loading
    }, function(error) {
        // handle errors
    }, function(node) {
        // handle node data
    });
  }*/
});
