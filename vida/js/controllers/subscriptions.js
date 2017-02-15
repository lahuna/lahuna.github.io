//*****************************************************************************************************************
// Copyright 2014 - 2017 Lahuna. All rights reserved.
// You may not copy, reproduce, republish, disassemble, decompile, reverse engineer, post, broadcast, transmit, or
// make available to the public any content or code on this website without prior written permission from Lahuna.
//*****************************************************************************************************************

'use strict';

var ctl = angular.module('SubscriptionsController', ['ResourceFactory', 'AuthenticateFactory']);

ctl.controller('SubscriptionsCtrl',
    function ($scope, $rootScope, $routeParams, SubscriptionResource, Auth, $route) {

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
            $scope.list = SubscriptionResource.Get({
                part: 'snippet,contentDetails',
                maxResults: '50',
                mine: 'true',
                accessToken: GetAccessToken()
            });
        }
    });
