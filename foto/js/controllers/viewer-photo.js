//*****************************************************************************************************************
// Copyright � 2014 - 2015 Lahuna. All rights reserved.
// You may not copy, reproduce, republish, disassemble, decompile, reverse engineer, post, broadcast, transmit, or
// make available to the public any content or code on this website without prior written permission from Lahuna.
//*****************************************************************************************************************

'use strict';

var ctl = angular.module('ViewerPhotoController', ['ResourceFactory', 'AuthenticateFactory']);

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

          PicasaPhotoResource($routeParams.photoId).Get({
              'alt': 'json',
              accessToken: GetAccessToken()
          }).$promise.then(function (data) {
              $scope.photo = data.entry;
              $scope.size = '800';

              var resource = data.entry.media$group.media$content[1];
              if (resource != undefined)
                  $scope.videoUrl = $sce.trustAsResourceUrl(data.entry.media$group.media$content[1].url);
          });
      }

      $scope.$watch('size', function (value) {
          if ($scope.photo != undefined) {
              $scope.photoUrl = $scope.photo.media$group.media$thumbnail[0].url.replace('72', value);
          }
      });

      $scope.Delete = function () {
          DeletePhotoResource.Delete({
              photoId: $scope.photo.gphoto$id.$t,
              albumId: $scope.photo.gphoto$albumid.$t,
              accessToken: GetAccessToken()
          });
      };

      $scope.Rotate = function (value) {
          var position = "";

          if ($scope.photo.position == undefined || $scope.photo.position == "")
              if (value == 90)
                  position = "rotate-right-90";
              else
                  position = "rotate-left-90";

          else if ($scope.photo.position == "rotate-right-90")
              if (value == 90)
                  position = "rotate-right-180";
              else
                  position = "";

          else if ($scope.photo.position == "rotate-left-90")
              if (value == 90)
                  position = "";
              else
                  position = "rotate-left-180";

          else if ($scope.photo.position.indexOf("180") > 0)
              if (value == 90)
                  position = "rotate-right-270";
              else
                  position = "rotate-left-270";

          $scope.photo.position = position;
          UpdatePhotoPartialResource.Update({
              photoId: $scope.photo.gphoto$id.$t,
              type: "rotation",
              value: value,
              accessToken: GetAccessToken()
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
