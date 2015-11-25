//*****************************************************************************************************************
// Copyright � 2014 - 2015 Lahuna. All rights reserved.
// You may not copy, reproduce, republish, disassemble, decompile, reverse engineer, post, broadcast, transmit, or
// make available to the public any content or code on this website without prior written permission from Lahuna.
//*****************************************************************************************************************

'use strict';

var ctl = angular.module('ViewerAlbumPhotosController', ['ResourceFactory', 'AuthenticateFactory']);

ctl.controller('ViewerAlbumPhotosCtrl', function ($scope, $routeParams, $modal, $log, Auth,
    PicasaAlbumFeedResource, PicasaPhotoResource) {

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
          $scope.myInterval = -1;
          GetPhoto();
      }

      function GetPhoto() {
          PicasaPhotoResource(localStorage.getItem('fotoId')).Get({
              'alt': 'json',
              'accessToken': GetAccessToken()
          }).$promise.then(function (data) {
              $scope.photo = data.entry;
              GetPhotos();
          });
      }

      function GetPhotos() {
        PicasaAlbumFeedResource($routeParams.albumId).Get({
            'kind': 'photo',
            'start-index': $scope.startIndex,
            'max-results': $scope.maxResults,
            'alt': 'json',
            accessToken: GetAccessToken()
          }).$promise.then(function (data) {
              $scope.list = data;
              SetActive();
          });
      }

      function SetActive() {
          //var index = $scope.list.feed.entry.indexOf($scope.photo);
          var index = GetIndex();
          $scope.list.feed.entry[index].active = true;
      }

      function GetIndex() {
          var i = 0;
          for (i = 0; i < $scope.list.feed.entry.length; i++) {
              if ($scope.list.feed.entry[i].gphoto$id.$t == localStorage.getItem('fotoId'))
                  return i;
          }

          // not found in list, so add to list
          $scope.list.feed.entry.splice(0, 1, $scope.photo);
          return 0;
      }

      //$scope.ShowVideo = function (photo) {
      //    var resource = photo.media$group.media$content[1];
      //    if (resource != undefined)
      //        $scope.url = $sce.trustAsResourceUrl(photo.media$group.media$content[1].url);

      //    $scope.showVid = true;
      //}

      $scope.StoreId = function (photoId) {
          localStorage.setItem('fotoId', photoId);
      }

      //$scope.Go = function (photo) {
      //    if (photo.gphoto$originalvideo != undefined) {
      //        localStorage.setItem('fotoId', photo.gphoto$id.$t);
      //        location.href = "/foto/#/video/viewer/" + photo.gphoto$id.$t;
      //    } else {
      //        localStorage.setItem('fotoId', photo.gphoto$id.$t);
      //        location.href = photo.media$group.media$thumbnail[0].url.replace('72', '1200');
      //    }

      //}

      $scope.Delete = function (photoItem) {
          var index = $scope.list.feed.entry.indexOf(photoItem);
          $scope.list.feed.entry.splice(index, 1);
          if ($scope.list.feed.entry.length > 0)
              $scope.list.feed.entry[0].active = true;
          DeletePhotoResource.Delete({
              photoId: photoItem.Id,
              albumId: $routeParams.albumId,
              accessToken: GetAccessToken()
          });
      };

      $scope.Rotate = function (photoItem, value) {
          var position = "";
          var index = $scope.list.feed.entry.indexOf(photoItem);

          if (photoItem.position == undefined || photoItem.position == "")
              if (value == 90)
                  position = "rotate-right-90";
              else
                  position = "rotate-left-90";

          else if (photoItem.position == "rotate-right-90")
              if (value == 90)
                  position = "rotate-right-180";
              else
                  position = "";

          else if (photoItem.position == "rotate-left-90")
              if (value == 90)
                  position = "";
              else
                  position = "rotate-left-180";

          else if (photoItem.position.indexOf("180") > 0)
              if (value == 90)
                  position = "rotate-right-270";
              else
                  position = "rotate-left-270";

          $scope.list.feed.entry[index].position = position;
          UpdatePhotoPartialResource.Update({
              photoId: photoItem.gphoto$id.$t,
              type: "rotation",
              value: value,
              accessToken: GetAccessToken()
          });
      };

      $scope.Tag = function (photoId) {

      };

      $scope.Share = function (photoId) {

      };

      $scope.Slideshow = function (photoItem) {
          if ($scope.myInterval == -1) {
              $scope.myInterval = 5000;
              var index = $scope.list.feed.entry.indexOf(photoItem);
              if (index == $scope.list.feed.entry.length - 1)
                  $scope.list.feed.entry[0].active = true;
              else
                  $scope.list.feed.entry[index + 1].active = true;
          }
          else
              $scope.myInterval = -1;
      };

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
