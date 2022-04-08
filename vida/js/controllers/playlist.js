//*****************************************************************************************************************
// Copyright 2014-2022 Lahuna. All rights reserved.
// You may not copy, reproduce, republish, disassemble, decompile, reverse engineer, post, broadcast, transmit, or
// make available to the public any content or code on this website without prior written permission from Lahuna.
//*****************************************************************************************************************

'use strict';

var ctl = angular.module('PlaylistController', ['ResourceFactory', 'AuthenticateFactory']);

ctl.controller('PlaylistCtrl', function ($scope, $rootScope, $routeParams, $window,
  PlaylistResource, PlaylistItemResource, PlaylistDbResource, PlaylistItemDbResource,
  Playlist, $route, Auth) {

  // Authenticate
  Auth.Authenticate('vida', function (result) {
    $rootScope.profile = result;
    $rootScope.showSignIn = !result;
    Initialize();
  });

  $rootScope.SignIn = function () {
    Auth.SignIn('vida');
  }

  $rootScope.SignOut = function () {
    Auth.SignOut('vida');
    $rootScope.profile = null;
    $rootScope.showSignIn = true;
    $route.reload();
  }

  function GetAccessToken() {
    return localStorage.getItem('youtube_access_token');
  }

  function Initialize() {

      $scope.emtpyPlaylist = false;
      $scope.notFound = false;
      $scope.playlistError = false;

      $scope.id = $routeParams.id;
      $scope.owner = $routeParams.owner;
      if ($routeParams.owner == 'me') {
          $scope.playlistType = 'playlist';
          $scope.playBtn = 'Play All / Edit';
      } else {
          $scope.playlistType = 'playlist-items';
          $scope.playBtn = 'Play All';
      }

      GetPlaylist();
      GetPlaylistItems();
  }

  function GetPlaylist() {
      PlaylistResource.Get({
        id: $routeParams.id,
        part: 'snippet,status',
        accessToken: GetAccessToken()
      }).$promise.then(function (data) {
        if (data.items.length > 0) {
          $scope.playlist = data;
        } else {
          $scope.notFound = true;
          PlaylistDbResource.Delete({
            playlistId: $routeParams.id,
            accessToken: GetAccessToken()
          });
        }
      }, function (error) {
        $scope.playlistError = true;
        //$scope.list.items = [];
      })
  }

  function GetPlaylistItems() {
      PlaylistItemResource.Get({
          playlistId: $routeParams.id,
          maxResults: '50',
          part: 'snippet',
          accessToken: GetAccessToken()
      }).$promise.then(function (data) {
          if (data.items.length > 0)
              $scope.list = data;
          else
              $scope.emptyPlaylist = true;
      }, function (error) {
          $scope.playlistError = true;
          //$scope.list.items = [];
      })
  }

  $scope.Back = function () {
      $window.history.back();
  }

  $scope.Reload = function () {
      $window.location.reload();
  }

  $scope.Delete = function () {
      PlaylistResource.Delete({
          id: $routeParams.id,
          accessToken: GetAccessToken()
      }).$promise.then(function (data) {
          // TODO: Handle Errors Here

          PlaylistDbResource.Delete({
              playlistId: $routeParams.id,
              accessToken: GetAccessToken()
          }).$promise.then(function () {
              $window.history.back();
          })
      })
  }

  $scope.Remove = function (index) {
      var playlistItemId = $scope.list.items[index].id;
      PlaylistItemResource.Delete({
          id: playlistItemId,
          accessToken: GetAccessToken()
      }).$promise.then(function (data) {
          $scope.list.items.splice(index, 1);
          PlaylistItemDbResource.Delete({
              playlistItemId: playlistItemId,
              accessToken: GetAccessToken()
          })
          UpdatePlaylist();
          if ($scope.list.items.length == 0)
              $scope.emptyPlaylist = true;
      })
  }

  $scope.MoveUp = function (index) {
      PlaylistItemResource.Put({
          id: $scope.list.items[index].id,
          snippet: {
              playlistId: $routeParams.id,
              resourceId: {
                  videoId: $scope.list.items[index].snippet.resourceId.videoId,
                  kind: 'youtube#video'
              },
              position: index - 1
          },
          accessToken: GetAccessToken()
      }).$promise.then(function (data) {
          var item = $scope.list.items.splice(index, 1);
          $scope.list.items.splice(index - 1, 0, item[0]);
          UpdatePlaylist();
      })
  }

  $scope.MoveDown = function (index) {
      PlaylistItemResource.Put({
          id: $scope.list.items[index].id,
          snippet: {
              playlistId: $routeParams.id,
              resourceId: {
                  videoId: $scope.list.items[index].snippet.resourceId.videoId,
                  kind: 'youtube#video'
              },
              position: index + 1
          },
          accessToken: GetAccessToken()
      }).$promise.then(function (data) {
          var item = $scope.list.items.splice(index, 1);
          $scope.list.items.splice(index + 1, 0, item[0]);
          UpdatePlaylist();
      })
  }

  $scope.select = function (item) {
      //var selected = item.Selected;

      var i = 0;
      for (i = 0; i < $scope.list.items.length; i++) {
          $scope.list.items[i].Selected = 0;
      }

      if (item.Selected == 0)
          item.Selected = 1;
      else
          item.Selected = 0;
  };

  function UpdatePlaylist() {
    Playlist.UpdatePlaylist($routeParams.id, function (result){

    });
  }

  function SetTags(pl) {
      if (pl.snippet.tags)
          return pl.snippet.tags.toString();
      else
          return '[]';
  }

  //function GetError(item) {
  //    if (item.status.rejectionReason != undefined)
  //        return item.status.rejectionReason;
  //    else
  //        return '';
  //}

});
