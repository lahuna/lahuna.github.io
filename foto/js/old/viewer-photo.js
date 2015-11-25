//*****************************************************************************************************************
// Copyright � 2014 - 2015 Lahuna. All rights reserved.
// You may not copy, reproduce, republish, disassemble, decompile, reverse engineer, post, broadcast, transmit, or
// make available to the public any content or code on this website without prior written permission from Lahuna.
//*****************************************************************************************************************

'use strict';

var ctl = angular.module('ViewerPhotoController', ['ResourceFactory', 'PhotoFactory', 'AuthenticateFactory']);

ctl.controller('ViewerPhotoCtrl', function ($scope, $routeParams, $modal, $log, $sce,
  PicasaPhotoResource, Auth) {

    $scope.needSignIn = false;
    Auth.Authenticate('foto', function (result) {
      $scope.needSignIn = result;
      Initialize();
    });

    function GetAccessToken() {
      return localStorage.getItem('google_access_token');
    }

      //****************************************
      // INITIALIZE
      //****************************************

      function Initialize() {
        Photo.GetPhoto({
          'photoId': $routeParams.photoId
        }, function (result) {
          if (result.error) {
            return;
          }
          $scope.photo = result.photo;
          $scope.size = '800';
          SetVideoUrl(result.photo);
        });
      }

      function SetVideoUrl(data) {
        var resource = data.entry.media$group.media$content[1];
        if (resource)
            $scope.videoUrl = $sce.trustAsResourceUrl(data.entry.media$group.media$content[1].url);
      }

      $scope.$watch('size', function (value) {
          if ($scope.photo) {
              $scope.photoUrl = $scope.photo.media$group.media$thumbnail[0].url.replace('72', value);
          }
      });

      $scope.Delete = function () {
        PicasaPhotoResource($scope.photo.gphoto$id.$t).Delete({
          accessToken: GetAccessToken()
        });


      };

      $scope.Rotate = function (value) {
        Photo.Rotate($scope.photo, value, function (position) {
          $scope.photo.position = position;
        });
      };

      $scope.Tag = function (photoId) {

      };

      $scope.Share = function (photoId) {

      };

      //photo.media$group.media$thumbnail[0].url | enlarge

      $scope.items = ['item1', 'item2', 'item3'];

      $scope.open = function (size, photoId) {

          var modalInstance = $modal.open({
              templateUrl: 'views/modal.html',
              controller: 'ModalInstanceCtrl',
              size: size,
              resolve: {
                  items: function () {
                      return $scope.items;
                  },
                  photoId: function () {
                      return photoId;
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
