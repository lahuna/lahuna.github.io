//*****************************************************************************************************************
// Copyright � 2014 - 2016 Lahuna. All rights reserved.
// You may not copy, reproduce, republish, disassemble, decompile, reverse engineer, post, broadcast, transmit, or
// make available to the public any content or code on this website without prior written permission from Lahuna.
//*****************************************************************************************************************

'use strict';

var ctl = angular.module('RecommendController', ['ResourceFactory', 'AuthenticateFactory', 'PlaylistFactory']);

ctl.controller('RecommendCtrl',
    function ($scope, $rootScope, $routeParams, $location, SearchResource, Auth,
        VideoResource, YoutubeSearchResource, ChannelResource, Playlist, $route) {

        // Authenticate
        Auth.Authenticate('vida', function (result) {
          $rootScope.profile = result;
          $rootScope.showSignIn = !result;
          Initialize();
        });

        $rootScope.SignIn = function () {
          Auth.SignIn('vida');
        }

        $rootScope.SignOut = function () {
          Auth.SignOut('vida');
          $rootScope.profile = null;
          $rootScope.showSignIn = true;
          $route.reload();
        }

        function GetAccessToken() {
          return localStorage.getItem('youtube_access_token');
        }

        function Initialize() {
            $scope.owner = 'yt';
            $scope.videoId = $routeParams.id;

            GetVideoList();
        }

        function GetVideoList() {
            YoutubeSearchResource.Get({
                part: 'snippet',
                maxResults: '49',
                type: 'video',
                relatedToVideoId: $routeParams.id,
                accessToken: GetAccessToken()
            }).$promise.then(function (data) {
                $scope.list = data;
                GetVideo();
            })
        }

        function GetVideo() {
            VideoResource.Get({
                part: 'snippet',
                id: $routeParams.id,
                accessToken: GetAccessToken()
            }).$promise.then(function (data) {
                $scope.heading = data.items[0].snippet.title;
                $scope.list.items.splice(0, 0, data.items[0]);
            })
        }

        //****************************************
        // ADD TO PLAYLIST
        //****************************************

        $scope.GetPlaylistHints = function (val) {
            return SearchResource.Get({
                query: val,
                type: 'playlist',
                userId: localStorage.getItem('youtube_user_id'),
                maxdocs: 10
            }).$promise.then(function (data) {
                return data.list;
            });
        }

        $scope.AddToPlaylist = function (index) {
          var inP = $scope.list.items[index].inPlaylist;
            if (!inP) {
              $scope.list.items[index].inPlaylist = true;
            } else {
              $scope.list.items[index].inPlaylist = false;
            }

          var video = $scope.list.items[index];
          var title = $scope.playlist;
          Playlist.AddToPlaylist(video, title, function (playlistId, playlistItemId) {
            $scope.playlistId = playlistId;
            $scope.list.items[index].playlistItemId = playlistItemId;
          });
        }

        $scope.$watch('playlist', function (value) {
            if (!$scope.list || !$scope.list.items)
                return;

            $scope.playlistId = '';
            for (var i = 0; i < $scope.list.items.length; i++) {
                $scope.list.items[i].inPlaylist = false;
                delete $scope.list.items[i].playlistItemId;
            }
        });
    });
