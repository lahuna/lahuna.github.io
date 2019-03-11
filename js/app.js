//*****************************************************************************************************************
// Copyright 2014-2019 Lahuna. All rights reserved.
// You may not copy, reproduce, republish, disassemble, decompile, reverse engineer, post, broadcast, transmit, or
// make available to the public any content or code on this website without prior written permission from Lahuna.
//*****************************************************************************************************************

'use strict';

var app = angular.module('lahuna', [
  'ngRoute',
  'MainController',
  'ContactController',
  'LogController',
  'IpController',
  'WikiController',
  'Filters'
]);

app.config(
    function ($routeProvider, $locationProvider) {
        $locationProvider.html5Mode(false).hashPrefix('');
        $routeProvider.
            when('/', {
                templateUrl: 'views/home.html',
                controller: 'MainCtrl'
						}).
						when('/sydney', {
							templateUrl: 'views/sydney/main.html',
							controller: 'MainCtrl'
						}).
						when('/sydney/code-for-good', {
							templateUrl: 'views/sydney/code-for-good.html',
							controller: 'MainCtrl'
						}).
						when('/sydney/kimlean-project', {
							templateUrl: 'views/sydney/kimlean-project.html',
							controller: 'MainCtrl'
						}).
						when('/sydney/artistic-engineer', {
							templateUrl: 'views/sydney/artistic-engineer.html',
							controller: 'MainCtrl'
						}).
						when('/sydney/diverse-mediator', {
							templateUrl: 'views/sydney/diverse-mediator.html',
							controller: 'MainCtrl'
						}).
						when('/sydney/riptide', {
							templateUrl: 'views/sydney/riptide.html',
							controller: 'MainCtrl'
						}).
						when('/sydney/clean-water-challenge', {
							templateUrl: 'views/sydney/clean-water-challenge.html',
							controller: 'MainCtrl'
						}).
						when('/sydney/ideal-college', {
							templateUrl: 'views/sydney/ideal-college.html',
							controller: 'MainCtrl'
						}).
						when('/sydney/volunteer-work', {
							templateUrl: 'views/sydney/volunteer-work.html',
							controller: 'MainCtrl'
						}).
						when('/sydney/leadership-discovery', {
							templateUrl: 'views/sydney/leadership-discovery.html',
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
            //when('/rest', {
                //templateUrl: 'views/rest.html',
                //controller: 'RestCtrl'
            //}).
            when('/admin', {
                templateUrl: 'views/admin.html',
                controller: 'MainCtrl'
            }).
            when('/chanthu', {
                templateUrl: 'views/chanthu.html',
                controller: 'MainCtrl'
            }).
            when('/notfound', {
                templateUrl: 'views/notfound.html',
                controller: 'MainCtrl'
            }).
            when('/log', {
                templateUrl: 'views/log.html',
                controller: 'LogCtrl'
            }).
            when('/log/:ip', {
                templateUrl: 'views/log.html',
                controller: 'LogCtrl'
            }).
            when('/ip', {
                templateUrl: 'views/ip.html',
                controller: 'IpCtrl'
            }).
            when('/ip/:ip', {
                templateUrl: 'views/ip.html',
                controller: 'IpCtrl'
            }).
            when('/social', {
                templateUrl: 'views/social.html',
                controller: 'MainCtrl'
            }).
            when('/wiki/extract/:title', {
                templateUrl: 'views/wiki-extract.html',
                controller: 'WikiExtractCtrl'
            }).
            otherwise({
                redirectTo: '/'
            });
  });
