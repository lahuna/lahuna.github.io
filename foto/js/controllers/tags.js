//*****************************************************************************************************************
// Copyright 2014 - 2017 Lahuna. All rights reserved.
// You may not copy, reproduce, republish, disassemble, decompile, reverse engineer, post, broadcast, transmit, or
// make available to the public any content or code on this website without prior written permission from Lahuna.
//*****************************************************************************************************************

'use strict';

var ctl = angular.module('TagsController', ['ResourceFactory', 'AuthenticateFactory']);

ctl.controller('TagsCtrl',
    function ($scope, $routeParams, SearchResource,
      Auth, $route, $rootScope) {

          // Authenticate
          Auth.Authenticate('foto', function (result) {
            $rootScope.profile = result;
            $rootScope.showSignIn = !result;
            Initialize();
          });

          $rootScope.SignIn = function () {
            Auth.SignIn('foto');
          }

          $rootScope.SignOut = function () {
            Auth.SignOut('foto');
            $rootScope.profile = null;
            $rootScope.showSignIn = true;
            $route.reload();
          }

          function GetAccessToken() {
            return localStorage.getItem('google_access_token');
          }

        //****************************************
        // INITIALIZE
        //****************************************

        function Initialize() {

            $scope.search = "";

            $scope.heading = GetHeading();
            $scope.path = GetPath();

            if (!localStorage.getItem("tag_search_picasa"))
                $scope.search = "";
            else
                $scope.search = localStorage.getItem("tag_search_picasa");

            $scope.items = SearchResource.Get({
                type: GetType(),
                userId: localStorage.getItem('google_user_id'),
                maxdocs: 100
            });
        }

        $scope.StoreFilter = function () {
            Auth.Store("tag_search_picasa", $scope.search);
        }

        $scope.ClearFilter = function () {
            $scope.search = "";
            Auth.Store("tag_search_picasa", "");
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

        function IsPhoto() {
            if ($routeParams.type == "photo")
                return true;
            else
                return false
        }

        function GetType() {
            if (IsPhoto())
                return "photo";
            else
                return "album";
        }

        function GetHeading() {
            if (IsPhoto())
                return "Photo Tags";
            else
                return "Album Tags";
        }

        function GetPath() {
            if (IsPhoto())
                return "photos";
            else
                return "albums";
        }
    });
