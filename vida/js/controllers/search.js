//*****************************************************************************************************************
// Copyright � 2014 - 2015 Lahuna. All rights reserved.
// You may not copy, reproduce, republish, disassemble, decompile, reverse engineer, post, broadcast, transmit, or
// make available to the public any content or code on this website without prior written permission from Lahuna.
//*****************************************************************************************************************

'use strict';

var ctl = angular.module('SearchController', ['ResourceFactory', 'AuthenticateFactory', 'PlaylistFactory']);

ctl.controller('SearchCtrl',
    function ($scope, $rootScope, $routeParams, $location, SearchResource,
      AutoCompleteResource, YoutubeSearchResource, Playlist, Auth, $route) {

        // Authenticate
        Auth.Authenticate('vida', function (result) {
          $rootScope.displayName = result;
          $rootScope.showSignIn = !result;
          Initialize();
        });

        $rootScope.SignIn = function () {
          Auth.SignIn('vida');
        }

        $rootScope.SignOut = function () {
          Auth.SignOut('vida');
          $rootScope.displayName = null;
          $rootScope.showSignIn = true;
          $route.reload();
        }

        function GetAccessToken() {
          return localStorage.getItem('youtube_access_token');
        }

        function Initialize() {
            $scope.owner = 'yt';
            $scope.orderVisible = true;

            if (!localStorage.getItem('youtube_search'))
                $scope.search = '';
            else
                $scope.search = localStorage.getItem('youtube_search');

            if (!localStorage.getItem('youtube_order'))
                $scope.order = 'viewCount';
            else
                $scope.order = localStorage.getItem('youtube_order');

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
            localStorage.setItem('youtube_search', $scope.search);
            localStorage.setItem('youtube_order', $scope.order);

            $scope.list = YoutubeSearchResource.Get({
                q: GetSearch(),
                part: 'snippet',
                order: GetOrder(),
                maxResults: '50',
                type: GetType(),
                accessToken: GetAccessToken()
            });
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

        function GetType() {
            var path = $location.path();
            if (path.indexOf('video') != -1 || path.indexOf('recommend') != -1)
                return 'video';
            else if (path.indexOf('playlist') != -1)
                return 'playlist';
            else if (path.indexOf('channel') != -1)
                return 'channel';
            else
                return;
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
            return AutoCompleteResource.Get({
                hl: 'en',
                ds: 'yt',
                client: 'youtube',
                hjson: 't',
                cp: '1',
                q: val,
                format: '5',
                alt: 'json',
                callback: 'JSON_CALLBACK'
            }).$promise.then(function (data) {
                var list = [];
                data = data[1];
                var i;
                for (var i in data) {
                  if (data[i][0]) {
                    var item = {'query': data[i][0]}
                    list.push(item);
                  }
                }

                return list;
            });
        };

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
