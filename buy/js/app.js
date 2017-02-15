//*****************************************************************************************************************
// Copyright 2014 - 2017 Lahuna. All rights reserved.
// You may not copy, reproduce, republish, disassemble, decompile, reverse engineer, post, broadcast, transmit, or
// make available to the public any content or code on this website without prior written permission from Lahuna.
//*****************************************************************************************************************

'use strict';

var app = angular.module('buy', [
  'ngRoute',
  'ui.bootstrap',
  'Filters',
  'ModalInstanceController',
  'MainController',
  'ProfileController',
  'StoreController',
  'StoresController',
  'CategoryController',
  'CategoriesController',
  'ProductController',
  'ProductsController',
  'CartController',
  'SuccessController',
  'OrderController'
]);

app.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.
            when('/', {
                templateUrl: 'views/main.html',
                controller: 'MainCtrl'
            }).
            when('/profile', {
                templateUrl: '/auth/views/profile.html',
                controller: 'ProfileCtrl'
            }).
            when('/get-started', {
                templateUrl: 'views/get-started.html',
                controller: 'MainCtrl'
            }).
            when('/stores', {
                templateUrl: 'views/stores.html',
                controller: 'StoresCtrl'
            }).
            when('/store', {
                templateUrl: 'views/store.html',
                controller: 'StoreCtrl'
            }).
            when('/store/:store_id', {
                templateUrl: 'views/store.html',
                controller: 'StoreCtrl'
            }).
            when('/store/:store_id/categories', {
                templateUrl: 'views/categories.html',
                controller: 'CategoriesCtrl'
            }).
            when('/store/:store_id/category/:category_id/products', {
                templateUrl: 'views/products.html',
                controller: 'ProductsCtrl'
            }).
            when('/store/:store_id/category/:category_id/product', {
                templateUrl: 'views/product.html',
                controller: 'ProductCtrl'
            }).
            when('/store/:store_id/product/:product_id', {
                templateUrl: 'views/product.html',
                controller: 'ProductCtrl'
            }).
            when('/store/:store_id/category/:category_id/product/:product_id', {
                templateUrl: 'views/product.html',
                controller: 'ProductCtrl'
            }).
            when('/cart', {
                templateUrl: 'views/cart.html',
                controller: 'CartCtrl'
            }).
            when('/success/:orderId', {
                templateUrl: 'views/success.html',
                controller: 'SuccessCtrl'
            }).
            when('/order/:orderId', {
                templateUrl: 'views/order.html',
                controller: 'OrderCtrl'
            }).
            otherwise({
                redirectTo: '/'
            });
  }]);
