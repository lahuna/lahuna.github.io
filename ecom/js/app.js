//*****************************************************************************************************************
// Copyright � 2014 - 2016 Lahuna. All rights reserved.
// You may not copy, reproduce, republish, disassemble, decompile, reverse engineer, post, broadcast, transmit, or
// make available to the public any content or code on this website without prior written permission from Lahuna.
//*****************************************************************************************************************

'use strict';

var app = angular.module('ecom', [
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
  'ProductsController'
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
            when('/shop', {
                templateUrl: 'views/shop.html',
                controller: 'MainCtrl'
            }).
            when('/sell', {
                templateUrl: 'views/sell.html',
                controller: 'MainCtrl'
            }).
            when('/sell/stores', {
                templateUrl: 'views/stores.html',
                controller: 'StoresCtrl'
            }).
            when('/sell/store', {
                templateUrl: 'views/store.html',
                controller: 'StoreCtrl'
            }).
            when('/sell/store/:store_id', {
                templateUrl: 'views/store.html',
                controller: 'StoreCtrl'
            }).
            when('/sell/store/:store_id/categories', {
                templateUrl: 'views/categories.html',
                controller: 'CategoriesCtrl'
            }).
            when('/sell/store/:store_id/category', {
                templateUrl: 'views/category.html',
                controller: 'CategoryCtrl'
            }).
            when('/sell/store/:store_id/category/:category_id', {
                templateUrl: 'views/category.html',
                controller: 'CategoryCtrl'
            }).
            when('/sell/store/:store_id/category/:category_id/products', {
                templateUrl: 'views/products.html',
                controller: 'ProductsCtrl'
            }).
            when('/sell/store/:store_id/category/:category_id/product', {
                templateUrl: 'views/product.html',
                controller: 'ProductCtrl'
            }).
            when('/sell/store/:store_id/category/:category_id/product/:product_id', {
                templateUrl: 'views/product.html',
                controller: 'ProductCtrl'
            }).
            otherwise({
                redirectTo: '/'
            });
  }]);
