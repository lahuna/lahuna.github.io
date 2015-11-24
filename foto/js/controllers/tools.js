//*****************************************************************************************************************
// Copyright � 2014 - 2015 Lahuna. All rights reserved.
// You may not copy, reproduce, republish, disassemble, decompile, reverse engineer, post, broadcast, transmit, or
// make available to the public any content or code on this website without prior written permission from Lahuna.
//*****************************************************************************************************************

'use strict';

var ctl = angular.module('ToolsController', ['ResourceFactory', 'AuthenticateFactory']);

ctl.controller('ToolsCtrl',
    function ($scope, $routeParams, ImportPhotoResource, Auth) {

          $scope.needSignIn = false;
          Auth.Authenticate('foto', function (result) {
            $scope.needSignIn = result;
            Initialize();
          });

          function GetAccessToken() {
            return localStorage.getItem('google_access_token');
          }

        //*********************************************
        // Import
        //*********************************************

        $scope.ImportPhotos = function () {
            SetAlert('warning', 'Importing photos...');
            ImportPhotoResource.Post({
                job: 'false',
                accessToken: GetAccessToken()
            }).$promise.then(function (data) {
                if (data.success) {
                    SetAlert('success', "Photo import successful.");
                } else
                    SetAlert('danger', "Photo import failed.");
            });
        }

        $scope.closeAlert = function (index) {
            $scope.alerts.splice(index, 1);
        };

        function SetAlert(type, msg) {
            $scope.alerts = [{ type: type, msg: msg }];
        }
});
