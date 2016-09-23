//*****************************************************************************************************************
// Copyright � 2014 - 2016 Lahuna. All rights reserved.
// You may not copy, reproduce, republish, disassemble, decompile, reverse engineer, post, broadcast, transmit, or
// make available to the public any content or code on this website without prior written permission from Lahuna.
//*****************************************************************************************************************

'use strict';

var app = angular.module('vida', [
  'ngRoute',
  'ui.bootstrap',
  'Filters',
  'ActivityController',
  'ChannelController',
  'MainController',
  'PlaylistController',
  'PlaylistsController',
  'RecommendController',
  'SearchController',
  'SubscriptionsController',
  'TagsController',
  'ToolsController',
  'VideosController',
  'DataVideoController',
  'ProfileController'
]);

app.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.
            when('/', {
                templateUrl: 'views/main.html',
                controller: 'MainCtrl'
            }).
            //when('/initial', {
                //templateUrl: 'views/main.html',
                //controller: 'MainCtrl'
            //}).
            when('/upload', {
                templateUrl: 'views/upload.html',
                controller: 'MainCtrl'
            }).
            when('/profile', {
                templateUrl: '/auth/views/profile.html',
                controller: 'ProfileCtrl'
            }).
            when('/video/data', {
                templateUrl: 'views/data-video.html',
                controller: 'DataVideoCtrl'
            }).
            when('/videos', {
                templateUrl: 'views/search-video.html',
                controller: 'SearchCtrl'
            }).
            when('/playlists', {
                templateUrl: 'views/search-playlist.html',
                controller: 'SearchCtrl'
            }).
            when('/playlist/:owner/:id', {
                templateUrl: 'views/playlist.html',
                controller: 'PlaylistCtrl'
            }).
            when('/channels', {
                templateUrl: 'views/search-channel.html',
                controller: 'SearchCtrl'
            }).
            when('/my-videos', {
                templateUrl: 'views/my-videos.html',
                controller: 'VideosCtrl'
            }).
            when('/my-videos/:query', {
                templateUrl: 'views/my-videos.html',
                controller: 'VideosCtrl'
            }).
            //when('/my-videos-all', {
                //templateUrl: 'views/my-videos-all.html',
                //controller: 'VideosAllCtrl'
            //}).
            when('/my-playlists', {
                templateUrl: 'views/my-playlists.html',
                controller: 'PlaylistsCtrl'
            }).
            when('/my-playlists/:query', {
                templateUrl: 'views/my-playlists.html',
                controller: 'PlaylistsCtrl'
            }).
            //when('/my-playlists-all', {
                //templateUrl: 'views/my-playlists-all.html',
                //controller: 'PlaylistsAllCtrl'
            //}).
            when('/tags/:type', {
                templateUrl: 'views/tags.html',
                controller: 'TagsCtrl'
            }).
            when('/my-subscriptions', {
                templateUrl: 'views/my-subscriptions.html',
                controller: 'SubscriptionsCtrl'
            }).
            when('/my-channel', {
                templateUrl: 'views/my-channel.html',
                controller: 'ChannelCtrl'
            }).
            when('/activity/:owner/:channelId', {
                templateUrl: 'views/activity.html',
                controller: 'ActivityCtrl'
            }).
            //when('/activity-all', {
                //templateUrl: 'views/activity-all.html',
                //controller: 'ActivityAllCtrl'
            //}).
            when('/my-videos-new', {
                templateUrl: 'views/search-video-new.html',
                controller: 'VideosCtrl'
            }).
            when('/recommend', {
                templateUrl: 'views/search-recommend.html',
                controller: 'SearchCtrl'
            }).
            when('/recommend/:id', {
                templateUrl: 'views/recommend.html',
                controller: 'RecommendCtrl'
            }).
            when('/tools', {
                templateUrl: 'views/tools.html',
                controller: 'ToolsCtrl'
            }).
            //when('/edit/playlist/:id', {
            //    templateUrl: 'views/edit-playlist.html',
            //    controller: 'EditPlaylistCtrl'
            //}).
            //when('/edit/video/:id', {
            //    templateUrl: 'views/edit-video.html',
            //    controller: 'EditVideoCtrl'
            //}).
            otherwise({
                redirectTo: '/'
            });
  }]);
