//*****************************************************************************************************************
// Copyright � 2014 - 2015 Lahuna. All rights reserved.
// You may not copy, reproduce, republish, disassemble, decompile, reverse engineer, post, broadcast, transmit, or
// make available to the public any content or code on this website without prior written permission from Lahuna.
//*****************************************************************************************************************

'use strict';

var ctl = angular.module('TagsController', ['ResourceFactory', 'AuthenticateFactory']);

ctl.controller('TagsCtrl',
    function ($scope, $routeParams, SearchResource, Auth) {

        $scope.needSignIn = false;
        Auth.Authenticate('vida', function (result) {
          $scope.needSignIn = result;
          Initialize();
        });

        function GetAccessToken() {
          return localStorage.getItem('youtube_access_token');
        }

        function Initialize() {

            $scope.search = '';

            $scope.heading = GetHeading();
            $scope.path = GetPath();

            if (!localStorage.getItem('tag_search'))
                $scope.search = '';
            else
                $scope.search = localStorage.getItem('tag_search');

            $scope.items = SearchResource.Get({
                type: GetType(),
                userId: localStorage.getItem('youtube_user_id'),
                maxdocs: 100
            });
        }

        $scope.StoreFilter = function () {
            localStorage.setItem('tag_search', $scope.search);
        }

        $scope.ClearFilter = function () {
            $scope.search = '';
            localStorage.setItem('tag_search', '');
        }

        $scope.Delete = function (item) {
            var index = $scope.items.list.indexOf(item);
            $scope.items.list.splice(index, 1);
            SearchResource.Delete({
                query: item.query,
                type: GetType(),
                accessToken: GetAccessToken()
            });
        }

        function IsVideo() {
            if ($routeParams.type == 'video')
                return true;
            else
                return false
        }

        function GetType() {
            if (IsVideo())
                return 'video';
            else
                return 'playlist';
        }

        function GetHeading() {
            if (IsVideo())
                return 'Video Tags';
            else
                return 'Playlist Tags';
        }

        function GetPath() {
            if (IsVideo())
                return 'my-videos';
            else
                return 'my-playlists';
        }
    });