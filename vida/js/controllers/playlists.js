//*****************************************************************************************************************
// Copyright 2014-2019 Lahuna. All rights reserved.
// You may not copy, reproduce, republish, disassemble, decompile, reverse engineer, post, broadcast, transmit, or
// make available to the public any content or code on this website without prior written permission from Lahuna.
//*****************************************************************************************************************

'use strict';

var ctl = angular.module('PlaylistsController', ['ResourceFactory', 'AuthenticateFactory']);

ctl.controller('PlaylistsCtrl',
    function ($scope, $rootScope, $routeParams, PlaylistDbResource,
        SearchResource, Auth, $route) {

        Auth.Authenticate('vida', function (result) {
          $rootScope.profile = result;
          $rootScope.showSignIn = !result;
          if (result) {
            Initialize();
          }
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

            var query = $routeParams.query;
            if (query && query.length > 0)
                $scope.search = query;
            else {
                if (!localStorage.getItem('playlist_search'))
                    $scope.search = '';
                else
                    $scope.search = localStorage.getItem('playlist_search');
            }

            if (!localStorage.getItem('playlist_order'))
                $scope.order = 'date';
            else
                $scope.order = localStorage.getItem('playlist_order');

            Search();
        }

        //*********************************************
        // Search
        //*********************************************

        $scope.GoSearch = function ($event) {
            var keypressed = $event.keyCode || $event.which;
            if (keypressed == 13)
                Search();
        }

        $scope.ClickSearch = function () {
            Search();
        }

        function Search() {
            Auth.Store('playlist_search', $scope.search);
            Auth.Store('playlist_order', $scope.order);

            var query = GetQuery();
            PlaylistDbResource.Get({
                query: query,
                order: GetOrder(),
                maxdocs: 10,
                accessToken: GetAccessToken()
            }).$promise.then(function (data) {
                if (data.error) {
                  if (data.error == 'invalid_token') {
                    Auth.Authenticate('vida', function (result) {
                      $scope.displayName = result;
                      if (!result) {
                        Search();
                        return;
                      }
                    });
                  } else {
                    return;
                  }
                }

                if (!data.list) {
                  return;
                }

                $scope.items = data;
                if (query != '*') {
                    if (data.list.length > 0)
                        InsertSearch(query);
                    else
                        DeleteSearch(query);
                }
            });
        }

        function GetQuery() {
          if ($scope.search.length == 0) {
            return '*';
          } else {
            return $scope.search;
          }
        }

        function GetOrder() {
            if ($scope.order.length == 0) {
                $scope.order = 'date';
                return 'date';
            }
            else
                return $scope.order;
        }

        $scope.SelectOrder = function (value) {
            $scope.order = value;
            Search();
        }

        $scope.$watch('order', function (value) {
            switch(value) {

                case 'date':
                    $scope.orderText = 'Date';
                    break;

                case 'title':
                    $scope.orderText = 'Title';
                    break;
            }
        });

        //*********************************************
        // Import
        //*********************************************

        /*$scope.Import = function () {
            SetAlert('warning', 'Importing playlists...');

            ImportPlaylistResource.Get({
                job: 'false',
                accessToken: GetAccessToken()
            }).$promise.then(function (data) {
                $scope.response = data.message;
                if (data.success) {
                    SetAlert('success', 'Playlist import successful.');
                    Search();
                } else
                    SetAlert('danger', 'Playlist import failed.');
            });
        }

        $scope.closeAlert = function (index) {
            $scope.alerts.splice(index, 1);
        };

        function SetAlert(type, msg) {
            $scope.alerts = [{ type: type, msg: msg }];
        }*/

        //*********************************************
        // Search Suggestions
        //*********************************************

        $scope.GetSearchList = function (val) {
            return SearchResource.Get({
                query: val,
                type: 'playlist',
                userId: localStorage.getItem('youtube_user_id'),
                maxdocs: 10
            }).$promise.then(function (data) {
                return data.list;
            });
        }

        function InsertSearch(query) {
            SearchResource.Post({
                query: query,
                type: 'playlist',
                accessToken: GetAccessToken()
            });
        }

        function DeleteSearch(query) {
            SearchResource.Delete({
                query: query,
                type: 'playlist',
                accessToken: GetAccessToken()
            });
        }

    });
