//*****************************************************************************************************************
// Copyright � 2014 - 2016 Lahuna. All rights reserved.
// You may not copy, reproduce, republish, disassemble, decompile, reverse engineer, post, broadcast, transmit, or
// make available to the public any content or code on this website without prior written permission from Lahuna.
//*****************************************************************************************************************

'use strict';

var ctl = angular.module('CategoryEditController', ['ResourceFactory', 'AuthenticateFactory']);

ctl.controller('CategoryEditCtrl', function ($scope, $route, Auth, $rootScope,
  CategoryResource) {

  function GetAccessToken() {
    return localStorage.getItem('google_access_token');
  }

  $scope.origin = location.origin;
  Auth.Authenticate('order', function (result) {
    $rootScope.profile = result;
    $rootScope.showSignIn = !result;
  });

  $rootScope.SignIn = function () {
    Auth.SignIn('order');
  }

  $rootScope.SignOut = function () {
    Auth.SignOut('order');
    $rootScope.profile = null;
    $rootScope.showSignIn = true;
    $route.reload();
  }

  $scope.Save = function () {
    if (!$scope.item._Id) {
      CategoryResource.Post({
        accessToken: GetAccessToken(),
        name: $scope.item.name
      });
    } else {
      CategoryResource.Put({
        accessToken: GetAccessToken(),
        name: $scope.item.name
      });
    }


  }
});
