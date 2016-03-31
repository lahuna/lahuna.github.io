//*****************************************************************************************************************
// Copyright � 2014 - 2016 Lahuna. All rights reserved.
// You may not copy, reproduce, republish, disassemble, decompile, reverse engineer, post, broadcast, transmit, or
// make available to the public any content or code on this website without prior written permission from Lahuna.
//*****************************************************************************************************************

'use strict';

var app = angular.module('order', [
  'ngRoute',
  'Filters',
  'MainController',
  'ProfileController',
  'ShopController',
  'LearnSellController',
  'StoreEditController',
  'StoreController',
  'CategoryEditController',
  'CategoryController',
  'ProductEditController',
  'ProductController'
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
                controller: 'ShopCtrl'
            }).
            when('/learn/sell', {
                templateUrl: 'views/learn-sell.html',
                controller: 'LearnSellCtrl'
            }).
            when('/store/add', {
                templateUrl: 'views/store-edit.html',
                controller: 'StoreEditCtrl'
            }).
            when('/store/edit/:id', {
                templateUrl: 'views/store-edit.html',
                controller: 'StoreEditCtrl'
            }).
            when('/store', {
                templateUrl: 'views/store.html',
                controller: 'StoreCtrl'
            }).
            when('/category/add', {
                templateUrl: 'views/category-edit.html',
                controller: 'CategoryEditCtrl'
            }).
            when('/category/edit/:id', {
                templateUrl: 'views/category-edit.html',
                controller: 'CategoryEditCtrl'
            }).
            when('/category', {
                templateUrl: 'views/category.html',
                controller: 'CategoryCtrl'
            }).
            when('/product/add', {
                templateUrl: 'views/product-edit.html',
                controller: 'ProductEditCtrl'
            }).
            when('/product/edit/:id', {
                templateUrl: 'views/product-edit.html',
                controller: 'ProductEditCtrl'
            }).
            when('/product', {
                templateUrl: 'views/product.html',
                controller: 'ProductCtrl'
            }).
            otherwise({
                redirectTo: '/'
            });
  }]);
