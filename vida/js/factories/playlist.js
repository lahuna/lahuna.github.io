//*****************************************************************************************************************
// Copyright � 2014 - 2016 Lahuna. All rights reserved.
// You may not copy, reproduce, republish, disassemble, decompile, reverse engineer, post, broadcast, transmit, or
// make available to the public any content or code on this website without prior written permission from Lahuna.
//*****************************************************************************************************************

'use strict';

var fac = angular.module('PlaylistFactory', ['ResourceFactory']);

fac.factory('Playlist', function (AddToPlaylistResource,
  UpdatePlaylistResource, UpdateVideoResource) {

  return { 'AddToPlaylist': AddToPlaylist,
           'UpdatePlaylist': UpdatePlaylist,
           'UpdateVideo': UpdateVideo};

   function GetAccessToken() {
     return localStorage.getItem('youtube_access_token');
   }

  function AddToPlaylist(video, title, callback) {
    var videoId = GetVideoId(video);
    AddToPlaylistResource.Post({
      'videoId': videoId,
      'playlistItemId': video.playlistItemId,
      'title': title,
      'accessToken': GetAccessToken()
    })
    .$promise.then(function (data) {
      return callback(data.playlistId, data.playlistItemId);
    });
  }

  function UpdatePlaylist(playlistId, callback) {
    UpdatePlaylistResource.Put({
      'playlistId': playlistId,
      'accessToken': GetAccessToken()
    })
    .$promise.then(function (data) {
      return callback(data);
    });
  }

  function UpdateVideo(videoId, callback) {
    UpdateVideoResource.Put({
      'videoId': videoId,
      'accessToken': GetAccessToken()
    })
    .$promise.then(function (data) {
      return callback(data);
    });
  }

  function GetVideoId(video) {
    var videoId = video.id.videoId;

    if (!videoId && video.snippet.resourceId) {
      videoId = video.snippet.resourceId.videoId;
    }

    if (!videoId) {
      videoId = video.id;
    }

    return videoId;
  }
});
