//*****************************************************************************************************************
// Copyright 2014 - 2017 Lahuna. All rights reserved.
// You may not copy, reproduce, republish, disassemble, decompile, reverse engineer, post, broadcast, transmit, or
// make available to the public any content or code on this website without prior written permission from Lahuna.
//*****************************************************************************************************************

'use strict';

var ctl = angular.module('ViewerController', ['ResourceFactory', 'PhotoFactory', 'AuthenticateFactory']);

ctl.controller('ViewerCtrl', function ($scope, $routeParams, $modal, $log, $sce,
    Photo, PicasaPhotoResource, PhotoDbResource, StorageService, Auth, $route, $rootScope) {

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

          $scope.index = $routeParams.index;
          var data = StorageService.get();
          if (data) {
            $scope.photos = data;
            SetVideoUrl();
          } else {
            console.log('No data found');
          }
      }

      function SetVideoUrl() {
        var url = $scope.photos[$scope.index].url;
        if (url) {
          $scope.videoUrl = $sce.trustAsResourceUrl(url);
        } else {
          $scope.videoUrl = undefined;
        }
      }

      $scope.Next = function () {
        if ($scope.index == ($scope.photos.length - 1)) {
          $scope.index = 0;
        } else {
          $scope.index++;
        }

        SetVideoUrl();
      };

      $scope.Previous = function () {
        if ($scope.index == 0) {
          $scope.index = $scope.photos.length - 1;
        } else {
          $scope.index--;
        }

        SetVideoUrl();
      };

      $scope.Delete = function () {
        var photoId = $scope.photos[$scope.index].photoId;
        var _id = $scope.photos[$scope.index]._id;
        $scope.photos.splice($scope.index, 1);

        PicasaPhotoResource(photoId).Delete({
          accessToken: GetAccessToken()
        });

        PhotoDbResource.Delete({
          _id: _id,
          accessToken: GetAccessToken()
        });

      };

      $scope.Rotate = function (value) {
        Photo.Rotate($scope.photos[$scope.index], value, function (result) {
          $scope.photos[$scope.index] = result;
        });
      };

      $scope.open = function (size) {
        var modalInstance = $modal.open({
            templateUrl: 'views/modal.html',
            controller: 'ModalInstanceCtrl',
            size: size,
            resolve: {
                photoId: function () {
                    return $scope.photos[$scope.index].photoId;
                },
                type: function () {
                    return $scope.photos[$scope.index].type;
                }
            }
        });
      };

  });
