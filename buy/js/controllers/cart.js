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
      SetAlert('warning', 'Your cart is empty.');
      return;
    }

    CartResource.Get({
      _id: $scope.cart_id
    }).$promise.then(function (cart) {
      if (cart.message == 'No result' || cart.error) {
        SetAlert('warning', 'Your cart is empty.');
        return;
      }
      $scope.cart = cart;
      $scope.store = StoreResource.Get({
        _id: cart.store_id
      });
    });

    CartItemResource.Get({
      parent_id: $scope.cart_id,
      maxdocs: 50
    }).$promise.then(function (cart_items) {
      $scope.cart_items = cart_items;
      TotalCart();
    });
  }

  function TotalCart() {
    var total = 0;
    for (var i = 0; i < $scope.cart_items.list.length; i++) {
      var item = $scope.cart_items.list[i];
        total += (item.quantity * item.product.price);
    }
    $scope.total = total;
  }

  $scope.Save = function () {
    for (var i = 0; i < $scope.cart_items.list.length; i++) {
      var item = $scope.cart_items.list[i];
      CartItemResource.Put({
        _id: item._id,
        parent_id: item.parent_id,
        product_id: item.product_id,
        quantity: item.quantity
      });
    }

    SetAlert('success', 'Cart updated.');
  }

  $scope.QuantityChanged = function (item, index) {
    //SetAlert('warning', 'Click Save to accept your changes.');
    if (item.quantity) {
      var quantity = parseInt(item.quantity);
      if (quantity > 100) {
        quantity = 100;
      } else if (quantity < 0) {
        quantity = 0;
      }
      $scope.cart_items.list[index].quantity = quantity;
    }
    TotalCart();
  }

  $scope.Delete = function (item, index) {
    $scope.cart_items.list.splice(index, 1);
    CartItemResource.Delete({
      _id: item._id
    }).$promise.then(function (data) {
      if ($scope.cart_items.list.length == 0) {
        SetAlert('warning', 'Your cart is empty.');
        CartResource.Delete({
          _id: $scope.cart_id
        }).$promise.then(function (result) {
          localStorage.removeItem('cart_id');
        });
      } else {
        SetAlert('success', 'Item deleted.');
      }
    });
  }

  function SetAlert(type, msg) {
      $scope.alerts = [{ type: type, msg: msg }];
  }

  $scope.closeAlert = function (index) {
      $scope.alerts.splice(index, 1);
  };
});
