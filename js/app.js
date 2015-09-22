//*****************************************************************************************************************
// Copyright © 2014 - 2015 Lahuna. All rights reserved.
// You may not copy, reproduce, republish, disassemble, decompile, reverse engineer, post, broadcast, transmit, or
// make available to the public any content or code on this website without prior written permission from Lahuna.
//*****************************************************************************************************************

'use strict';

/* App Module */

var fotoApp = angular.module('lahuna', [
  'ngRoute',
  'Controllers',
  'Filters',
  'Services'
]);

fotoApp.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.
            when('/', {
                templateUrl: 'views/home.html',
                controller: 'MainCtrl'
            }).
            when('/apps', {
                templateUrl: 'views/apps.html',
                controller: 'MainCtrl'
            }).
            when('/about', {
                templateUrl: 'views/about.html',
                controller: 'MainCtrl'
            }).
            when('/consult', {
                templateUrl: 'views/consult.html',
                controller: 'MainCtrl'
            }).
            when('/contact', {
                templateUrl: 'views/contact.html',
                controller: 'ContactCtrl'
            }).
            when('/privacy', {
                templateUrl: 'views/privacy.html',
                controller: 'MainCtrl'
            }).
            when('/terms', {
                templateUrl: 'views/terms.html',
                controller: 'MainCtrl'
            }).
            when('/tech', {
                templateUrl: 'views/tech.html',
                controller: 'MainCtrl'
            }).
            when('/rest', {
                templateUrl: 'views/rest.html',
                controller: 'RestCtrl'
            }).
            when('/admin', {
                templateUrl: 'views/admin.html',
                controller: 'MainCtrl'
            }).
            when('/chanthu', {
                templateUrl: 'views/chanthu.html',
                controller: 'MainCtrl'
            }).
            otherwise({
                redirectTo: '/'
            });
  }]);