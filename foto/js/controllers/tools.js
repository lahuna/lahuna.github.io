//*****************************************************************************************************************
// Copyright � 2014 - 2015 Lahuna. All rights reserved.
// You may not copy, reproduce, republish, disassemble, decompile, reverse engineer, post, broadcast, transmit, or
// make available to the public any content or code on this website without prior written permission from Lahuna.
//*****************************************************************************************************************

'use strict';

var ctl = angular.module('ToolsController', ['ResourceFactory', 'AuthenticateFactory', 'OboeFactory']);

ctl.controller('ToolsCtrl',
    function ($scope, $routeParams, $q, Auth, Oboe,
    ImportResource, ImportAlbumResource, ImportPhotoResource) {

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

        $scope.Import = function () {
            SetAlert('warning', 'Importing albums & photos...');
            ImportResource.Get({
                job: 'false',
                accessToken: GetAccessToken()
            }).$promise.then(function (data) {
                if (data.success) {
                    SetAlert('success', 'Album & Photo import successful.');
                } else
                    SetAlert('danger', 'Album & Photo import failed.');
            });
        }

        $scope.ImportAlbums = function () {
            SetAlert('warning', 'Importing albums...');
            ImportAlbumResource.Get({
                job: 'false',
                accessToken: GetAccessToken()
            }).$promise.then(function (data) {
                if (data.success) {
                    SetAlert('success', 'Album import successful.');
                } else
                    SetAlert('danger', 'Album import failed.');
            });
        }

        $scope.ImportPhotos = function () {
          SetAlert('warning', 'Importing photos...');

          ResetForm();

          Oboe.get({url: location.origin + ':8080/photo/import?accessToken=' + GetAccessToken()}
          ).then(function() {
              // finished loading
          }, function(error) {
              // handle errors
          }, function(node) {

            $scope.status = node;

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
              $scope.gErr.push(node.gErr);
            }

            if (node.dbErr) {
              $scope.errors++;
              $scope.dbErr.push(node.dbErr);
            }

            if (node.done) {
              if ($scope.errors == 0) {
                SetAlert('success', "Photo import successful.");
              } else {
                SetAlert('danger', "Photo import failed.");
              }
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
          $scope.gErr = [];
          $scope.dbErr = [];
        }
});
