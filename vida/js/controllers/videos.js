//*****************************************************************************************************************
// Copyright 2014-2019 Lahuna. All rights reserved.
// You may not copy, reproduce, republish, disassemble, decompile, reverse engineer, post, broadcast, transmit, or
// make available to the public any content or code on this website without prior written permission from Lahuna.
//*****************************************************************************************************************

'use strict';

var ctl = angular.module('VideosController', ['ResourceFactory', 'AuthenticateFactory', 'PlaylistFactory']);

ctl.controller('VideosCtrl',
    function ($scope, $rootScope, $routeParams, SearchResource,
      YoutubeSearchResource, Playlist, Auth, $route) {

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
            $scope.owner = 'me';
            $scope.orderVisible = false;

            var query = $routeParams.query;
            if (query && query.length > 0)
                $scope.search = query;
            else {
                if (!localStorage.getItem('video_search'))
                    $scope.search = '';
                else
                    $scope.search = localStorage.getItem('video_search');
            }

            if (!localStorage.getItem('video_order'))
                $scope.order = 'relevance';
            else
                $scope.order = localStorage.getItem('video_order');

            Search();
        }

        //****************************************
        // SEARCH
        //****************************************

        $scope.GoSearch = function ($event) {
            var keypressed = $event.keyCode || $event.which;
            if (keypressed == 13)
                Search();
        }

        $scope.ClickSearch = function () {
            Search();
        }

        function Search() {
            Auth.Store('video_search', $scope.search);
            Auth.Store('video_order', $scope.order);

            var query = GetSearch();
            YoutubeSearchResource.Get({
                q: query,
                part: 'snippet',
                order: GetOrder(),
                maxResults: '50',
                type: 'video',
                forMine: 'true',
                accessToken: GetAccessToken()
            }).$promise.then(function (data) {
                $scope.list = data;
                if (query) {
                    if (data.items.length > 0)
                        InsertSearch(query);
                    else
                        DeleteSearch(query);
                }
            })
        }

        function GetSearch() {
            if ($scope.search.length == 0)
                return;
            else
                return $scope.search;
        }

        function GetOrder() {
            if ($scope.order.length == 0)
                return;
            else
                return $scope.order;
        }

        $scope.SelectOrder = function (value) {
            $scope.order = value;
            Search();
        }

        $scope.$watch('order', function (value) {
            switch (value) {
                case 'relevance':
                    $scope.orderText = 'Relevance';
                    break;

                case 'viewCount':
                    $scope.orderText = 'View Count';
                    break;

                case 'rating':
                    $scope.orderText = 'Rating';
                    break;

                case 'date':
                    $scope.orderText = 'Date';
                    break;

                case 'title':
                    $scope.orderText = 'Title';
                    break;
            }
        });

        //****************************************
        // SEARCH HINTS
        //****************************************

        $scope.GetSearchList = function (val) {
            return SearchResource.Get({
                query: val,
                type: 'video',
                userId: localStorage.getItem('youtube_user_id'),
                maxdocs: 10
            }).$promise.then(function (data) {
                return data.list;
            });
        }

        function InsertSearch(query) {
            SearchResource.Post({
                query: query,
                type: 'video',
                accessToken: GetAccessToken()
            });
        }

        function DeleteSearch(query) {
            SearchResource.Delete({
                query: query,
                type: 'video',
                accessToken: GetAccessToken()
            });
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
