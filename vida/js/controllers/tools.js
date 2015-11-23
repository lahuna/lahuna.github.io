//*****************************************************************************************************************
// Copyright � 2014 - 2015 Lahuna. All rights reserved.
// You may not copy, reproduce, republish, disassemble, decompile, reverse engineer, post, broadcast, transmit, or
// make available to the public any content or code on this website without prior written permission from Lahuna.
//*****************************************************************************************************************

'use strict';

var ctl = angular.module('ToolsController', ['ResourceFactory', 'AuthenticateFactory']);

ctl.controller('ToolsCtrl',
    function ($scope, $routeParams,
        ImportVideoResource, ImportPlaylistItemResource, Auth) {

        $scope.needSignIn = false;
        Auth.authenticate(function (result) {
          $scope.needSignIn = result;
          Initialize();
        });

        $scope.ImportVideos = function () {
            SetAlert('warning', 'Importing videos...');
            ImportVideoResource.Post({
                job: 'false',
                accessToken: Auth.getAccessToken()
            }).$promise.then(function (data) {
                if (data.success) {
                    SetAlert('success', 'Video import successful.');
                } else
                    SetAlert('danger', 'Video import failed.');
            });
        }

        $scope.ImportPlaylistItems = function () {
            SetAlert('warning', 'Importing playlist items...');
            ImportPlaylistItemResource.Post({
                job: 'false',
                accessToken: Auth.getAccessToken()
            }).$promise.then(function (data) {
                if (data.success) {
                    SetAlert('success', 'Playlist item import successful.');
                } else
                    SetAlert('danger', 'Playlist item import failed.');
            });
        }

        $scope.closeAlert = function (index) {
            $scope.alerts.splice(index, 1);
        };

        function SetAlert(type, msg) {
            $scope.alerts = [{ type: type, msg: msg }];
        }
    });
