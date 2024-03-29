//*****************************************************************************************************************
// Copyright 2014-2022 Lahuna. All rights reserved.
// You may not copy, reproduce, republish, disassemble, decompile, reverse engineer, post, broadcast, transmit, or
// make available to the public any content or code on this website without prior written permission from Lahuna.
//*****************************************************************************************************************

'use strict';

/* App Module */

var app = angular.module('blitz', [
  'ngRoute',
  'ngTouch',
  'Controllers',
  'Filters'
]);

app.config(
    function ($routeProvider, $locationProvider) {
      $locationProvider.html5Mode(false).hashPrefix('');
      $routeProvider.
        when('/', {
            templateUrl: 'views/main.html',
            controller: 'MainCtrl'
        }).
        //when('/google/code=:code', {
        //    templateUrl: 'views/main.html',
        //    controller: 'GoogleCtrl'
        //}).
        when('/facebook', {
            templateUrl: 'views/facebook/main.html',
            controller: 'FacebookMainCtrl'
        }).
        when('/facebook/posts', {
            templateUrl: 'views/facebook/posts.html',
            controller: 'FacebookPostsCtrl'
        }).
        when('/facebook/state=:state&access_token=:access_token&expires_in=:expires_in', {
            templateUrl: 'views/main.html',
            controller: 'FacebookCtrl'
        }).
        when('/imgur/access_token=:access_token&expires_in=:expires_in&token_type=:token_type&refresh_token=:refresh_token&account_username=:account_username&account_id=:account_id', {
            templateUrl: 'views/main.html',
            controller: 'ImgurCtrl'
        }).
        when('/reddit/state=:state&code=:code', {
            templateUrl: 'views/main.html',
            controller: 'RedditCtrl'
        }).
        when('/linkedin/code=:code&state=:state', {
            templateUrl: 'views/main.html',
            controller: 'LinkedInCtrl'
        }).
        when('/twitter/oauth_token=:oauth_token&oauth_verifier=:oauth_verifier', {
            templateUrl: 'views/main.html',
            controller: 'TwitterCtrl'
        }).
        when('/tumblr/oauth_token=:oauth_token&oauth_verifier=:oauth_verifier', {
            templateUrl: 'views/main.html',
            controller: 'TumblrCtrl'
        }).
        otherwise({
            redirectTo: '/'
        });
  });
