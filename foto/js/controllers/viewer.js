//*****************************************************************************************************************
// Copyright � 2014 - 2016 Lahuna. All rights reserved.
// You may not copy, reproduce, republish, disassemble, decompile, reverse engineer, post, broadcast, transmit, or
// make available to the public any content or code on this website without prior written permission from Lahuna.
//*****************************************************************************************************************

'use strict';

var ctl = angular.module('ViewerController', ['ResourceFactory', 'PhotoFactory', 'AuthenticateFactory']);

ctl.controller('ViewerCtrl', function ($scope, $routeParams, $modal, $log, $sce,
    Photo, PicasaPhotoResource, StorageService, Auth, $route, $rootScope) {

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

          $scope.index = $routeParams.photoId;
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
        $scope.index++;
        SetVideoUrl();
      };

      $scope.Previous = function () {
        $scope.index--;
        SetVideoUrl();
      };

      $scope.Delete = function () {
        if (!$scope.photos) {
          return;
        }

        $scope.photos.splice($scope.index, 1);
        PicasaPhotoResource($scope.photos[$scope.index].photoId).Delete({
          accessToken: GetAccessToken()
        });
        // TODO: delete photo from db

      };

      $scope.Rotate = function (value) {
        if (!$scope.photos) {
          return;
        }

        Photo.Rotate($scope.photos[$scope.index], value, function (position) {
          $scope.photos[$scope.index].position = position;
        });
      };

      $scope.items = ['item1', 'item2', 'item3'];

      $scope.open = function (size) {
        if (!$scope.photos) {
          return;
        }

        var modalInstance = $modal.open({
            templateUrl: 'views/modal.html',
            controller: 'ModalInstanceCtrl',
            size: size,
            resolve: {
                items: function () {
                    return $scope.items;
                },
                photoId: function () {
                    return $scope.photos[$scope.index].photoId;
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
      };

  });
