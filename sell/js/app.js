//*****************************************************************************************************************
// Copyright 2014-2019 Lahuna. All rights reserved.
// You may not copy, reproduce, republish, disassemble, decompile, reverse engineer, post, broadcast, transmit, or
// make available to the public any content or code on this website without prior written permission from Lahuna.
//*****************************************************************************************************************

'use strict';

var app = angular.module('sell', [
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
  'StripeController'
]);

app.config(
    function ($routeProvider, $locationProvider) {
        $locationProvider.html5Mode(false).hashPrefix('');
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
            when('/store/:store_id/category', {
                templateUrl: 'views/category.html',
                controller: 'CategoryCtrl'
            }).
            when('/store/:store_id/category/:category_id', {
                templateUrl: 'views/category.html',
                controller: 'CategoryCtrl'
            }).
            when('/store/:store_id/category/:category_id/products', {
                templateUrl: 'views/products.html',
                controller: 'ProductsCtrl'
            }).
            when('/store/:store_id/category/:category_id/product', {
                templateUrl: 'views/product.html',
                controller: 'ProductCtrl'
            }).
            when('/store/:store_id/category/:category_id/product/:product_id', {
                templateUrl: 'views/product.html',
                controller: 'ProductCtrl'
            }).
            when('/stripe', {
                templateUrl: 'views/stripe.html',
                controller: 'StripeCtrl'
            }).
            otherwise({
                redirectTo: '/'
            });
  });
