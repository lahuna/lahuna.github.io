//*****************************************************************************************************************
// Copyright 2014-2018 Lahuna. All rights reserved.
// You may not copy, reproduce, republish, disassemble, decompile, reverse engineer, post, broadcast, transmit, or
// make available to the public any content or code on this website without prior written permission from Lahuna.
//*****************************************************************************************************************

'use strict';

var ctl = angular.module('PhotosController', ['ResourceFactory', 'AuthenticateFactory']);

ctl.controller('PhotosCtrl', function ($scope, $routeParams, StorageService,
        PhotoDbResource, SearchResource, Auth, $route, $rootScope) {

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

            $scope.albumId = $routeParams.albumId;
            var query = $routeParams.query;
            if (query && query.length > 0)
                $scope.search = query;
            else {
                if (!localStorage.getItem("photo_search"))
                    $scope.search = "";
                else
                    $scope.search = localStorage.getItem("photo_search");
            }

            if (!localStorage.getItem("photo_order"))
                $scope.order = "date";
            else
                $scope.order = localStorage.getItem("photo_order");

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
            Auth.Store("photo_search", $scope.search);
            Auth.Store("photo_order", $scope.order);

            var query = $scope.search;
            PhotoDbResource.Get({
                albumId: $scope.albumId,
                query: GetQuery(),
                order: GetOrder(),
                maxdocs: 100,
                accessToken: GetAccessToken()
            }).$promise.then(function (data) {
                $scope.items = data.list;
                StorageService.set(data.list);
                if (query.length > 0) {
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
            }
            else
                return $scope.search;
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
            switch (value) {

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
            SetAlert('warning', 'Importing photos...');

            ImportPhotoResource.Get({
              accessToken: GetAccessToken()
            })
            .$promise.then(function (data) {
                //$scope.response = data.message;
                if (data.success) {
                    SetAlert('success', 'Photo import successful.');
                    Search();
                } else
                    SetAlert('danger', 'Photo import failed');
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
                type: "photo",
                userId: localStorage.getItem('google_user_id'),
                maxdocs: 10
            }).$promise.then(function (data) {
                return data;
            });
        }

        function InsertSearch(query) {
            SearchResource.Post({
                query: query,
                type: "photo",
                accessToken: GetAccessToken()
            });
        }

        function DeleteSearch(query) {
            SearchResource.Delete({
                query: query,
                type: "photo",
                accessToken: GetAccessToken()
            });
        }

    });
