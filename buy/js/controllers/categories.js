//*****************************************************************************************************************
// Copyright 2014-2019 Lahuna. All rights reserved.
// You may not copy, reproduce, republish, disassemble, decompile, reverse engineer, post, broadcast, transmit, or
// make available to the public any content or code on this website without prior written permission from Lahuna.
//*****************************************************************************************************************

'use strict';

var ctl = angular.module('CategoriesController', ['ResourceFactory', 'AuthenticateFactory']);

ctl.controller('CategoriesCtrl',
    function ($scope, $rootScope, $routeParams, CategoryResource,
        StoreResource, SearchResource, Auth, $route) {

        Auth.Authenticate('buy', function (result) {
          $rootScope.profile = result;
          $rootScope.showSignIn = !result;
          Initialize();
        });

        $rootScope.SignIn = function () {
          Auth.SignIn('buy');
        }

        $rootScope.SignOut = function () {
          Auth.SignOut('buy');
          $rootScope.profile = null;
          $rootScope.showSignIn = true;
          $route.reload();
        }

        function GetAccessToken() {
          return localStorage.getItem('google_access_token');
        }

        function Initialize() {

            $scope.store_id = $routeParams.store_id;
            GetStore();

            var query = $routeParams.query;
            if (query && query.length > 0)
                $scope.search = query;
            else {
                if (!localStorage.getItem('category_search'))
                    $scope.search = '';
                else
                    $scope.search = localStorage.getItem('category_search');
            }

            if (!localStorage.getItem('category_order'))
                $scope.order = 'date';
            else
                $scope.order = localStorage.getItem('category_order');

            Search();
        }

        function GetStore() {
          $scope.store = StoreResource.Get({
            accessToken: GetAccessToken(),
            _id: $routeParams.store_id
          });
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
            Auth.Store('category_search', $scope.search);
            Auth.Store('category_order', $scope.order);

            var query = GetQuery();
            CategoryResource.Get({
                query: query,
                order: GetOrder(),
                maxdocs: 50,
                parent_id: $routeParams.store_id,
                accessToken: GetAccessToken()
            }).$promise.then(function (data) {
                if (data.error) {
                  if (data.error == 'invalid_token') {
                    Auth.Authenticate('buy', function (result) {
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
                    $scope.orderText = 'Name';
                    break;
            }
        });

        $scope.GetSearchList = function (val) {
            return SearchResource.Get({
                query: val,
                type: 'Category',
                userId: localStorage.getItem('google_user_id'),
                maxdocs: 10
            }).$promise.then(function (data) {
                return data.list;
            });
        }

        function InsertSearch(query) {
            SearchResource.Post({
                query: query,
                type: 'order',
                accessToken: GetAccessToken()
            });
        }

        function DeleteSearch(query) {
            SearchResource.Delete({
                query: query,
                type: 'order',
                accessToken: GetAccessToken()
            });
        }

    });
