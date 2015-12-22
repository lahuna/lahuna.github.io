//*****************************************************************************************************************
// Copyright � 2014 - 2015 Lahuna. All rights reserved.
// You may not copy, reproduce, republish, disassemble, decompile, reverse engineer, post, broadcast, transmit, or
// make available to the public any content or code on this website without prior written permission from Lahuna.
//*****************************************************************************************************************

'use strict';

var ctl = angular.module('ViewerController', ['ResourceFactory', 'PhotoFactory', 'AuthenticateFactory']);

ctl.controller('ViewerCtrl', function ($scope, $routeParams, $modal, $log, $sce,
    PicasaAlbumFeedResource, PicasaPhotoResource, Photo, Auth, $route, $rootScope) {

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
          $scope.myInterval = -1;
          var photoId;
          if ($routeParams.photoId) {
            photoId = $routeParams.photoId;
          } else {
            photoId = localStorage.getItem('fotoId');
          }

          Photo.GetPhoto({
            'photoId': photoId,
            'albumId': $routeParams.albumId, // only for album photos
            'tag': $routeParams.tag, // only for search photos
            'startIndex': $routeParams.startIndex,
            'maxResults': $routeParams.maxResults,
          }, function (result) {
            if (result.error) {
              return;
            }
            $scope.photo = result.photo;

            if (result.list) {
              $scope.list = result.list;
              SetActive();
            } else {
              $scope.size = '800';
              SetVideoUrl(result.photo);
            }
          });
      }

      function SetVideoUrl(data) {
        var resource = data.media$group.media$content[1];
        if (resource)
            $scope.videoUrl = $sce.trustAsResourceUrl(resource.url);
      }

      $scope.$watch('size', function (value) {
          if ($scope.photo) {
              $scope.photoUrl = $scope.photo.media$group.media$thumbnail[0].url.replace('72', value);
          }
      });

      function SetActive() {
        //var index = $scope.list.feed.entry.indexOf($scope.photo);
        var index = GetIndex();
        if (index > -1) {
          $scope.list.feed.entry[index].active = true;
        }
      }

      function GetIndex() {
        if (!$scope.list.feed.entry) {
          return -1;
        }

        for (var i = 0; i < $scope.list.feed.entry.length; i++) {
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
        if ($scope.list) {
          var index = $scope.list.feed.entry.indexOf(photoItem);
          $scope.list.feed.entry.splice(index, 1);
          if ($scope.list.feed.entry.length > 0)
              $scope.list.feed.entry[0].active = true;
        }

        PicasaPhotoResource(photoItem.gphoto$id.$t).Delete({
          accessToken: GetAccessToken()
        });
      };

      $scope.Rotate = function (photoItem, value) {
        Photo.Rotate(photoItem, value, function (position) {
          if ($scope.list) {
            var index = $scope.list.feed.entry.indexOf(photoItem);
            $scope.list.feed.entry[index].position = position;
          } else {
            $scope.photo.position = position;
          }
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
