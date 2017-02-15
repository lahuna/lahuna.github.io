//*****************************************************************************************************************
// Copyright 2014 - 2017 Lahuna. All rights reserved.
// You may not copy, reproduce, republish, disassemble, decompile, reverse engineer, post, broadcast, transmit, or
// make available to the public any content or code on this website without prior written permission from Lahuna.
//*****************************************************************************************************************

'use strict';

var ctl = angular.module('DataVideoController', ['ResourceFactory', 'AuthenticateFactory']);

ctl.controller('DataVideoCtrl',
    function ($scope, $rootScope, $routeParams, VideoDbResource,
        SearchResource, Auth, $route) {

        // Authenticate
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
                if (!localStorage.getItem('video_search'))
                    $scope.search = '';
                else
                    $scope.search = localStorage.getItem('video_search');
            }

            if (!localStorage.getItem('video_order'))
                $scope.order = 'date';
            else
                $scope.order = localStorage.getItem('video_order');

            if (!localStorage.getItem('video_privacy'))
                $scope.privacy = 'all';
            else
                $scope.privacy = localStorage.getItem('video_privacy');

            if (!localStorage.getItem('video_def'))
                $scope.def = 'all';
            else
                $scope.def = localStorage.getItem('video_def');

            if (!localStorage.getItem('video_embed'))
                $scope.embed = 'all';
            else
                $scope.embed = localStorage.getItem('video_issue');

            if (!localStorage.getItem('video_issue'))
                $scope.issue = 'all';
            else
                $scope.issue = localStorage.getItem('video_issue');

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
            Auth.Store('video_search', $scope.search);
            Auth.Store('video_order', $scope.order);
            Auth.Store('video_privacy', $scope.privacy);
            Auth.Store('video_def', $scope.def);
            Auth.Store('video_embed', $scope.embed);
            Auth.Store('video_issue', $scope.issue);

            var query = GetQuery();
            VideoDbResource.Get({
                query: query,
                order: GetOrder(),
                privacy: GetPrivacy(),
                def: GetDef(),
                embed: GetEmbed(),
                issue: GetIssue(),
                maxdocs: 50,
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

        function GetPrivacy() {
            if ($scope.privacy.length == 0) {
                $scope.privacy = 'all';
                return 'all';
            }
            else
                return $scope.privacy;
        }

        $scope.SelectPrivacy = function (value) {
            $scope.privacy = value;
            Search();
        }

        $scope.$watch('privacy', function (value) {
          $scope.privacyText = value;
        });

        function GetDef() {
            if ($scope.def.length == 0) {
                $scope.def = 'all';
                return 'all';
            }
            else
                return $scope.def;
        }

        $scope.SelectDef = function (value) {
            $scope.def = value;
            Search();
        }

        $scope.$watch('def', function (value) {
          $scope.defText = value;
        });

        function GetEmbed() {
            if ($scope.embed.length == 0) {
                $scope.embed = 'all';
                return 'all';
            }
            else
                return $scope.embed;
        }

        $scope.SelectEmbed = function (value) {
            $scope.embed = value;
            Search();
        }

        $scope.$watch('embed', function (value) {
          $scope.embedText = value;
        });

        function GetIssue() {
            if ($scope.issue.length == 0) {
                $scope.issue = 'all';
                return 'all';
            }
            else
                return $scope.issue;
        }

        $scope.SelectIssue = function (value) {
            $scope.issue = value;
            Search();
        }

        $scope.$watch('issue', function (value) {
          $scope.issueText = value;
        });

        //*********************************************
        // Search Suggestions
        //*********************************************

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

    });
