//*****************************************************************************************************************
// Copyright 2014-2019 Lahuna. All rights reserved.
// You may not copy, reproduce, republish, disassemble, decompile, reverse engineer, post, broadcast, transmit, or
// make available to the public any content or code on this website without prior written permission from Lahuna.
//*****************************************************************************************************************

'use strict';

var ctl = angular.module('StoreController', ['ResourceFactory', 'AuthenticateFactory']);

ctl.controller('StoreCtrl', function ($scope, $route, Auth, $rootScope,
  $routeParams, $uibModal, StoreResource) {

  function GetAccessToken() {
    return localStorage.getItem('google_access_token');
  }

  $scope.origin = location.origin;
  Auth.Authenticate('buy', function (result) {
    $rootScope.profile = result;
    $rootScope.showSignIn = !result;
    Initialize();
  });

  $rootScope.SignIn = function () {
    Auth.SignIn('buy');
  }

  $rootScope.SignOut = function () {
    Auth.SignOut('buy');
    $rootScope.profile = null;
    $rootScope.showSignIn = true;
    $route.reload();
  }

  function Initialize() {
    $scope.store_id = $routeParams.store_id;

    if (!$routeParams.store_id) {
      return;
    }
    $scope.item = StoreResource.Get({
      accessToken: GetAccessToken(),
      _id: $routeParams.store_id
    });
  }

  $scope.Save = function () {
    var now = new Date();
    if (!$scope.item._id) {
      StoreResource.Post({
        accessToken: GetAccessToken(),
        title: $scope.item.title,
        desc: $scope.item.desc,
        phone: $scope.item.phone,
        email: $scope.item.email,
        address1: $scope.item.address1,
        address2: $scope.item.address2,
        city: $scope.item.city,
        state: $scope.item.state,
        zip: $scope.item.zip,
        published: now.toISOString()
      }).$promise.then(function (data) {
          $scope.item._id = data.insertedId;
          SetAlert('success', 'Store added.');
      });
    } else {
      StoreResource.Put({
        accessToken: GetAccessToken(),
        _id: $scope.item._id,
        title: $scope.item.title,
        desc: $scope.item.desc,
        phone: $scope.item.phone,
        email: $scope.item.email,
        address1: $scope.item.address1,
        address2: $scope.item.address2,
        city: $scope.item.city,
        state: $scope.item.state,
        zip: $scope.item.zip,
        published: now.toISOString()
      }).$promise.then(function (data) {
          SetAlert('success', 'Store updated.');
      });
    }
  }

  $scope.Delete = function () {
    var modalInstance = $uibModal.open({
        templateUrl: '/views/modal.html',
        controller: 'ModalInstanceCtrl',
        animation: true,
        backdrop: true,
        size: 'sm',
        resolve: {
          title: function () {
            return "Delete";
          },
          btn: function () {
            return "Delete";
          },
          msg: function () {
            return "Are you sure you want to delete this store?";
          }
        }
      });

    modalInstance.result.then(function (result) {
        if (result == 'ok')
            Delete();
    });
  }

  function Delete() {
    StoreResource.Delete({
      accessToken: GetAccessToken(),
      _id: $scope.item._id
    }).$promise.then(function (data) {
        $scope.item = undefined;
        SetAlert('success', 'Store deleted.');
    });
  }

  function SetAlert(type, msg) {
      $scope.alerts = [{ type: type, msg: msg }];
  }

  $scope.closeAlert = function (index) {
      $scope.alerts.splice(index, 1);
  };
});
