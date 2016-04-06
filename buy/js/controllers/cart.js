//*****************************************************************************************************************
// Copyright � 2014 - 2016 Lahuna. All rights reserved.
// You may not copy, reproduce, republish, disassemble, decompile, reverse engineer, post, broadcast, transmit, or
// make available to the public any content or code on this website without prior written permission from Lahuna.
//*****************************************************************************************************************

'use strict';

var ctl = angular.module('CartController', ['ResourceFactory', 'AuthenticateFactory']);

ctl.controller('CartCtrl', function ($scope, $route, Auth, $rootScope,
  $routeParams, $modal, CartResource, CartItemResource, StoreResource, ProductResource) {

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
    $scope.cart_id = localStorage.getItem('cart_id');

    if (!$scope.cart_id) {
      SetAlert('warning', 'Your cart is empty.')
      return;
    }

    CartResource.Get({
      _id: $scope.cart_id
    }).$promise.then(function (cart) {
      $scope.cart = cart;
      $scope.store = StoreResource.Get({
        _id: cart.store_id
      });
    });

    $scope.cart_items = CartItemResource.Get({
      parent_id: $scope.cart_id,
      maxdocs: 50
    });

    /*CartItemResource.Get({
      parent_id: $scope.cart_id,
      maxdocs: 50
    }).$promise.then(function (cartItems) {
      for (var i = 0; i < cartItems.list.length; i++) {
        ProductResource.Get({
          _id: cartItems.list[i].product_id
        }).$promise.then(function (product) {
          cartItems.list[i].product = product;
        });
      }
      $scope.cart_items = cartItems;
    });*/
  }

  $scope.Save = function () {
    var now = new Date();
    $scope.item.published = now.toISOString();
    $scope.item.accessToken = GetAccessToken();
    $scope.item.parent_id = $routeParams.store_id;

    if (!$scope.item._id) {
      CartResource.Post(
        $scope.item
      ).$promise.then(function (data) {
          $scope.item._id = data.insertedId;
          SetAlert('success', 'Cart added.');
      });
    } else {
      CartResource.Put(
        $scope.item
      ).$promise.then(function (data) {
          SetAlert('success', 'Cart updated.');
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
            return "Are you sure you want to delete this cart.";
          }
        }
      });

    modalInstance.result.then(function (result) {
        if (result == 'ok')
            Delete();
    });
  }

  function Delete() {
    CartResource.Delete({
      accessToken: GetAccessToken(),
      _id: $scope.item._id
    }).$promise.then(function (data) {
        $scope.item = undefined;
        SetAlert('success', 'Cart deleted.');
    });
  }

  function SetAlert(type, msg) {
      $scope.alerts = [{ type: type, msg: msg }];
  }

  $scope.closeAlert = function (index) {
      $scope.alerts.splice(index, 1);
  };
});
