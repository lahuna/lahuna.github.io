//*****************************************************************************************************************
// Copyright � 2014 - 2015 Lahuna. All rights reserved.
// You may not copy, reproduce, republish, disassemble, decompile, reverse engineer, post, broadcast, transmit, or
// make available to the public any content or code on this website without prior written permission from Lahuna.
//*****************************************************************************************************************

'use strict';

var ctl = angular.module('ActivityController', ['ResourceFactory', 'AuthenticateFactory', 'PlaylistFactory']);

ctl.controller('ActivityCtrl', function ($scope, $routeParams, Playlist, Auth,
  PlaylistItemResource, ChannelResource, SubscriptionResource, SearchResource) {

  $scope.needSignIn = false;
  Auth.Authenticate('vida', function (result) {
    $scope.needSignIn = result;
    Initialize();
  });

  function GetAccessToken() {
    return localStorage.getItem('youtube_access_token');
  }

  function Initialize() {

    $scope.btnVisible = ($routeParams.owner == 'yt')
    $scope.owner = $routeParams.owner;
    $scope.subscriptionId = '-1';

    GetChannel();
    GetSubscription();
  }

  function GetChannel() {
      ChannelResource(GetAccessToken()).Get({
          part: 'snippet,contentDetails',
          id: $routeParams.channelId,
      }).$promise.then(function (data) {
          $scope.heading = data.items[0].snippet.title;
          GetPlaylistItems(data.items[0].contentDetails.relatedPlaylists.uploads);
      });
  }

  function GetPlaylistItems(playlistId) {
      $scope.list = PlaylistItemResource(GetAccessToken()).Get({
          playlistId: playlistId,
          part: 'snippet',
          maxResults: '50'
      });
  }

  function GetSubscription() {
      SubscriptionResource(GetAccessToken()).Get({
          part: 'snippet',
          forChannelId: $routeParams.channelId,
          mine: 'true'
      }).$promise.then(function (data) {
          if (data.items.length > 0) {
              SetMode(data.items[0].id);
          } else
              SetMode('-1');
      });
  }

  $scope.Subscribe = function () {
      if ($scope.subscribed) {
          SubscriptionResource(GetAccessToken()).Delete({
              id: $scope.subscriptionId
          }).$promise.then(function (data) {
              SetMode('-1');
          });
      } else {
          SubscriptionResource(GetAccessToken()).Post({
              snippet: { resourceId: { channelId: $routeParams.channelId } }
          }).$promise.then(function (data) {
              SetMode(data.id);
          });
      }
  }

  function SetMode(subscriptionId) {
      $scope.subscriptionId = subscriptionId;
      if (subscriptionId == -1) {
          $scope.btnIcon = 'glyphicon glyphicon-play';
          $scope.btnText = 'Subscribe';
          $scope.subscribed = false;
      } else {
          $scope.btnIcon = 'glyphicon glyphicon-remove';
          $scope.btnText = 'Unsubscribe';
          $scope.subscribed = true;
      }
  }

  //****************************************
  // ADD TO PLAYLIST
  //****************************************

  $scope.GetPlaylistHints = function (val) {
      return SearchResource.Get({
          query: val,
          type: 'playlist',
          userId: localStorage.getItem('youtube_user_id')
      }).$promise.then(function (data) {
          return data.list;
      });
  }

  $scope.AddToPlaylist = function (index) {
    var inP = $scope.list.items[index].inPlaylist;
      if (!inP) {
        $scope.list.items[index].inPlaylist = true;
      } else {
        $scope.list.items[index].inPlaylist = false;
      }

    var video = $scope.list.items[index];
    var title = $scope.playlist;
    Playlist.AddToPlaylist(video, title, function (playlistItemId) {
      $scope.list.items[index].playlistItemId = playlistItemId;
    });
  }

  $scope.$watch('playlist', function (value) {
      if (!$scope.list || !$scope.list.items)
          return;

      var i = 0;
      for (i = 0; i < $scope.list.items.length; i++) {
          $scope.list.items[i].inPlaylist = false;
          delete $scope.list.items[i].playlistItemId;
      }
  });
});
