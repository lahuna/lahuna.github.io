//*****************************************************************************************************************
// Copyright � 2014 - 2016 Lahuna. All rights reserved.
// You may not copy, reproduce, republish, disassemble, decompile, reverse engineer, post, broadcast, transmit, or
// make available to the public any content or code on this website without prior written permission from Lahuna.
//*****************************************************************************************************************

'use strict';

var ctl = angular.module('StoreEditController', ['ResourceFactory', 'AuthenticateFactory']);

ctl.controller('StoreEditCtrl', function ($scope, $route, Auth, $rootScope, $routeParams,
  StoreResource) {

  function GetAccessToken() {
    return localStorage.getItem('google_access_token');
  }

  $scope.origin = location.origin;
  Auth.Authenticate('order', function (result) {
    $rootScope.profile = result;
    $rootScope.showSignIn = !result;
    Initialize();
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

  function Initialize() {
    if (!$routeParams.id) {
      return;
    }
    $scope.item = StoreResource.Get({
      accessToken: GetAccessToken(),
      maxdocs: 50,
      _id: $routeParams.id
    });
  }

  $scope.Save = function () {
    if (!$scope.item._id) {
      StoreResource.Post({
        accessToken: GetAccessToken(),
        name: $scope.item.name,
        desc: $scope.item.desc,
        phone: $scope.item.phone,
        email: $scope.item.email,
        address1: $scope.item.address1,
        address2: $scope.item.address2,
        city: $scope.item.city,
        state: $scope.item.state,
        zip: $scope.item.zip
      }).$promise.then(function (data) {
          $scope.item._id = data.insertedId;
          SetAlert('success', 'Store added.');
      });
    } else {
      StoreResource.Put({
        accessToken: GetAccessToken(),
        _id: $scope.item._id,
        name: $scope.item.name,
        desc: $scope.item.desc,
        phone: $scope.item.phone,
        email: $scope.item.email,
        address1: $scope.item.address1,
        address2: $scope.item.address2,
        city: $scope.item.city,
        state: $scope.item.state,
        zip: $scope.item.zip
      }).$promise.then(function (data) {
          SetAlert('success', 'Store updated.');
      });
    }
  }

  function SetAlert(type, msg) {
      $scope.alerts = [{ type: type, msg: msg }];
  }
});
