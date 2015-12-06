//*****************************************************************************************************************
// Copyright � 2014 - 2015 Lahuna. All rights reserved.
// You may not copy, reproduce, republish, disassemble, decompile, reverse engineer, post, broadcast, transmit, or
// make available to the public any content or code on this website without prior written permission from Lahuna.
//*****************************************************************************************************************

'use strict';

var ctl = angular.module('ToolsController', ['ResourceFactory', 'AuthenticateFactory', 'OboeFactory']);

ctl.controller('ToolsCtrl',
    function ($scope, $routeParams, $q, ImportPhotoResource, Auth, Oboe) {

          $scope.needSignIn = false;
          Auth.Authenticate('foto', function (result) {
            $scope.needSignIn = result;
          });

          function GetAccessToken() {
            return localStorage.getItem('google_access_token');
          }

        //*********************************************
        // Import
        //*********************************************

        ResetForm();

        $scope.ImportPhotos = function () {
          SetAlert('warning', 'Importing photos...');

          ResetForm();

          Oboe.get({url: location.origin + ':8000/photo/import?accessToken=' + GetAccessToken()}
          ).then(function() {
              // finished loading
          }, function(error) {
              // handle errors
          }, function(node) {

            if (node.albumCount) {
              $scope.albumCount = node.albumCount;
            }

            if (node.totalPhotos) {
              $scope.totalPhotos = node.totalPhotos;
            }

            if (node.imported) {
              $scope.imported += node.imported;
            }

            if (node.gErr) {
              $scope.errors++;
            }

            if (node.dbErr) {
              $scope.errors++;
            }

            if (node.success) {
              SetAlert('success', "Photo import successful.");
            }
          });
        }

        $scope.closeAlert = function (index) {
            $scope.alerts.splice(index, 1);
        };

        function SetAlert(type, msg) {
            $scope.alerts = [{ type: type, msg: msg }];
        }

        function ResetForm() {
          $scope.albumCount = 0;
          $scope.totalPhotos = 0;
          $scope.imported = 0;
          $scope.errors = 0;
        }
});
