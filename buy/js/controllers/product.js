//*****************************************************************************************************************
// Copyright � 2014 - 2016 Lahuna. All rights reserved.
// You may not copy, reproduce, republish, disassemble, decompile, reverse engineer, post, broadcast, transmit, or
// make available to the public any content or code on this website without prior written permission from Lahuna.
//*****************************************************************************************************************

'use strict';

var ctl = angular.module('ProductController', ['ResourceFactory', 'AuthenticateFactory']);

ctl.controller('ProductCtrl', function ($scope, $route, Auth, $rootScope,
  $routeParams, $modal, StoreResource, CategoryResource, ProductResource,
  CartResource, CartItemResource) {

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
    $scope.quantity = 1;
    $scope.store_id = $routeParams.store_id;
    $scope.category_id = $routeParams.category_id;

    GetStore();

    if (!$routeParams.product_id) {
      return;
    }
    ProductResource.Get({
      accessToken: GetAccessToken(),
      _id: $routeParams.product_id
    }).$promise.then(function (data) {
      $scope.item = data;
      $scope.cat_id = data.parent_id;
      GetCategory();
      CheckCart();
    });
  }

  function CheckCart() {
    var quantity = localStorage.getItem('quantity');
    if (localStorage.getItem('add-to-cart') == $scope.item._id && quantity) {
      $scope.quantity = quantity;
      AddToCart();
    }
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
      _id: $scope.cat_id
    });
  }

  $scope.$watch('quantity', function (value) {
    if (!value) {
      $scope.quantity = 1;
    } else {
      $scope.quantity = parseInt(value);
    }
  });

  $scope.AddToCart = function () {
    var cartId = localStorage.getItem('cart_id');
    var now = new Date();

    if (!cartId || cartId == 'undefined') {
      CartResource.Post({
        published: now.toISOString(),
        store_id: $scope.store_id
      }).$promise.then(function (data) {
          cartId = data.insertedId;
          localStorage.setItem('cart_id', cartId);
          AddCartItem(cartId);
      });
    }
    AddCartItem(cartId);
  }

  function AddCartItem(cartId) {
    CartItemResource.Post({
      parent_id: cartId,
      product_id: $scope.item._id,
      quantity: $scope.quantity
    }).$promise.then(function (data) {
        SetAlert('success', 'Added to cart.');
    });
  }

  function SetAlert(type, msg) {
      $scope.alerts = [{ type: type, msg: msg }];
  }

  $scope.closeAlert = function (index) {
      $scope.alerts.splice(index, 1);
  };
});
