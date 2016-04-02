//*****************************************************************************************************************
// Copyright � 2014 - 2016 Lahuna. All rights reserved.
// You may not copy, reproduce, republish, disassemble, decompile, reverse engineer, post, broadcast, transmit, or
// make available to the public any content or code on this website without prior written permission from Lahuna.
//*****************************************************************************************************************

'use strict';

var ctl = angular.module('CategoryController', ['ResourceFactory', 'AuthenticateFactory']);

ctl.controller('CategoryCtrl', function ($scope, $route, Auth, $rootScope,
  $routeParams, $modal, CategoryResource, StoreResource) {

  function GetAccessToken() {
    return localStorage.getItem('google_access_token');
  }

  $scope.origin = location.origin;
  Auth.Authenticate('ecom', function (result) {
    $rootScope.profile = result;
    $rootScope.showSignIn = !result;
    Initialize();
  });

  $rootScope.SignIn = function () {
    Auth.SignIn('ecom');
  }

  $rootScope.SignOut = function () {
    Auth.SignOut('ecom');
    $rootScope.profile = null;
    $rootScope.showSignIn = true;
    $route.reload();
  }

  function Initialize() {
    $scope.store_id = $routeParams.store_id;
    $scope.category_id = $routeParams.category_id;

    GetStore();

    if (!$routeParams.category_id) {
      return;
    }

    $scope.item = CategoryResource.Get({
      accessToken: GetAccessToken(),
      _id: $routeParams.category_id
    });
  }

  function GetStore() {
    $scope.store = StoreResource.Get({
      accessToken: GetAccessToken(),
      _id: $routeParams.store_id
    });
  }

  $scope.Save = function () {
    var now = new Date();
    $scope.item.published = now.toISOString();
    $scope.item.accessToken = GetAccessToken();
    $scope.item.parent_id = $routeParams.store_id;

    if (!$scope.item._id) {
      CategoryResource.Post(
        $scope.item
      ).$promise.then(function (data) {
          $scope.item._id = data.insertedId;
          SetAlert('success', 'Category added.');
      });
    } else {
      CategoryResource.Put(
        $scope.item
      ).$promise.then(function (data) {
          SetAlert('success', 'Category updated.');
      });
    }
  }

  $scope.Delete = function () {
    var modalInstance = $modal.open({
        templateUrl: '/views/modal.html',
        controller: 'ModalInstanceCtrl',
        animation: true,
        backdrop: true,
        size: 'sm'
    });

    modalInstance.result.then(function (result) {
        if (result == 'ok')
            Delete();
    });
  }

  function Delete() {
    CategoryResource.Delete({
      accessToken: GetAccessToken(),
      _id: $scope.item._id
    }).$promise.then(function (data) {
        $scope.item = undefined;
        SetAlert('success', 'Category deleted.');
    });
  }

  function SetAlert(type, msg) {
      $scope.alerts = [{ type: type, msg: msg }];
  }

  $scope.closeAlert = function (index) {
      $scope.alerts.splice(index, 1);
  };
});
