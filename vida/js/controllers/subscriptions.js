//*****************************************************************************************************************
// Copyright � 2014 - 2015 Lahuna. All rights reserved.
// You may not copy, reproduce, republish, disassemble, decompile, reverse engineer, post, broadcast, transmit, or
// make available to the public any content or code on this website without prior written permission from Lahuna.
//*****************************************************************************************************************

'use strict';

var ctl = angular.module('SubscriptionsController', ['ResourceFactory', 'AuthenticateFactory']);

ctl.controller('SubscriptionsCtrl',
    function ($scope, $routeParams, SubscriptionResource, Auth) {

        $scope.needSignIn = false;
        Auth.Authenticate('vida', function (result) {
          $scope.needSignIn = result;
          Initialize();
        });

        function GetAccessToken() {
          return localStorage.getItem('youtube_access_token');
        }

        function Initialize() {
            $scope.list = SubscriptionResource(GetAccessToken()).Get({
                part: 'snippet,contentDetails',
                maxResults: '50',
                mine: 'true'
            });
        }
    });
