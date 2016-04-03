//*****************************************************************************************************************
// Copyright � 2014 - 2016 Lahuna. All rights reserved.
// You may not copy, reproduce, republish, disassemble, decompile, reverse engineer, post, broadcast, transmit, or
// make available to the public any content or code on this website without prior written permission from Lahuna.
//*****************************************************************************************************************

'use strict';

var ctl = angular.module('ProductController', ['ResourceFactory', 'AuthenticateFactory']);

ctl.controller('ProductCtrl', function ($scope, $route, Auth, $rootScope,
  $routeParams, $modal, StoreResource, CategoryResource, ProductResource) {

  function GetAccessToken() {
    return localStorage.getItem('google_access_token');
  }

  $scope.origin = location.origin;
  Auth.Authenticate('sell', function (result) {
    $rootScope.profile = result;
    $rootScope.showSignIn = !result;
    Initialize();
  });

  $rootScope.SignIn = function () {
    Auth.SignIn();
  }

  $rootScope.SignOut = function () {
    Auth.SignOut();
    $rootScope.profile = null;
    $rootScope.showSignIn = true;
    $route.reload();
  }

  function Initialize() {
    $scope.store_id = $routeParams.store_id;
    $scope.category_id = $routeParams.category_id;

    GetStore();
    GetCategory();

    if (!$routeParams.product_id) {
      return;
    }
    $scope.item = ProductResource.Get({
      accessToken: GetAccessToken(),
      _id: $routeParams.product_id
    });
  }

  function GetStore() {
    $scope.store = StoreResource.Get({
      accessToken: GetAccessToken(),
      _id: $routeParams.store_id
    });
  }

  function GetCategory() {
    $scope.category = CategoryResource.Get({
      accessToken: GetAccessToken(),
      _id: $routeParams.category_id
    });
  }

  $scope.Save = function () {
    var now = new Date();
    $scope.item.published = now.toISOString();
    $scope.item.accessToken = GetAccessToken();
    $scope.item.parent_id = $routeParams.category_id;

    if (!$scope.item._id) {
      ProductResource.Post(
        $scope.item
      ).$promise.then(function (data) {
          $scope.item._id = data.insertedId;
          SetAlert('success', 'Product added.');
      });
    } else {
      ProductResource.Put(
        $scope.item
      ).$promise.then(function (data) {
          SetAlert('success', 'Product updated.');
      });
    }
  }

  $scope.Delete = function () {
    var modalInstance = $modal.open({
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
            return "Are you sure you want to delete this product?";
          }
        }
      });

    modalInstance.result.then(function (result) {
        if (result == 'ok')
            Delete();
    });
  }

  function Delete() {
    ProductResource.Delete({
      accessToken: GetAccessToken(),
      _id: $scope.item._id
    }).$promise.then(function (data) {
        $scope.item = undefined;
        SetAlert('success', 'Product deleted.');
    });
  }

  function SetAlert(type, msg) {
      $scope.alerts = [{ type: type, msg: msg }];
  }

  $scope.closeAlert = function (index) {
      $scope.alerts.splice(index, 1);
  };
});
