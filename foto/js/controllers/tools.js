/*****************************************************************************************************************
 Copyright � 2014 - 2015 Lahuna. All rights reserved.
 You may not copy, reproduce, republish, disassemble, decompile, reverse engineer, post, broadcast, transmit, or
 make available to the public any content or code on this website without prior written permission from Lahuna.
*****************************************************************************************************************/

'use strict';

var ctl = angular.module('ToolsController', ['ResourceFactory', 'AuthenticateFactory', 'OboeFactory']);

ctl.controller('ToolsCtrl',
    function ($scope, $routeParams, Auth, Oboe) {

          // Authenticate
          Auth.Authenticate('foto', function (result) {
            $scope.displayName = result;
          });

          function GetAccessToken() {
            return localStorage.getItem('google_access_token');
          }

        //*********************************************
        // Import
        //*********************************************

        ResetForm();

        $scope.Import = function () {
          RunImport('foto/import');
        }

        $scope.ImportAlbums = function () {
          RunImport('album/import');
        }

        $scope.ImportPhotos = function () {
          RunImport('photo/import');
        }

        $scope.closeAlert = function (index) {
            $scope.alerts.splice(index, 1);
        };

        function RunImport(path) {
          SetAlert('warning', 'Importing...');
          ResetForm();
          Oboe.get({url: location.origin + ':8080/' + path + '?accessToken=' + GetAccessToken()}
          ).then(function() {
              // finished loading
          }, function(error) {
              // handle errors
          }, function(node) {
            HandleNode(node);
          });
        }

        function HandleNode(node) {
          if (node.imported) {
            $scope.imported = node;
          } else {
            $scope.status.push(node);
          }

          if (node.done) {
            SetAlert('success', "Import completed.");
          }
        }

        function ResetForm() {
          $scope.imported = '';
          $scope.status = [];
        }

        function SetAlert(type, msg) {
            $scope.alerts = [{ type: type, msg: msg }];
        }
});
