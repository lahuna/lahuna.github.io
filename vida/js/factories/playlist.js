//*****************************************************************************************************************
// Copyright � 2014 - 2015 Lahuna. All rights reserved.
// You may not copy, reproduce, republish, disassemble, decompile, reverse engineer, post, broadcast, transmit, or
// make available to the public any content or code on this website without prior written permission from Lahuna.
//*****************************************************************************************************************

'use strict';

var fac = angular.module('PlaylistFactory', ['ResourceFactory', 'AuthenticateFactory']);

fac.factory('Playlist', function (Auth, PlaylistDbResource,
  PlaylistResource, PlaylistItemDbResource, PlaylistItemResource) {

  return { 'AddToPlaylist': AddToPlaylist,
           'UpdatePlaylist': UpdatePlaylist };

  function AddToPlaylist(video, title, callback) {
    GetPlaylistId(video, title, function (playlistItemId) {
      return callback(playlistItemId);
    });
  }

  function GetPlaylistId(video, title, callback) {
   var videoId = GetVideoId(video);
   PlaylistDbResource.Get({
     title: title,
     accessToken: Auth.getAccessToken()
   }).$promise.then(function (data) {
       if (data.list.length > 0) {
         var plid = data.list[0].playlistId;
         if (video.playlistItemId) {
           RemovePlaylistItem(plid, video.playlistItemId, function () {
             return callback();
           });
         } else {
           GetPlaylistItem(videoId, plid, function (playlistItemId) {
             callback(playlistItemId);
           });
         }
       } else {
         CreatePlaylist(videoId, title, function (playlistItemId) {
          callback(playlistItemId);
         });
       }
   });
  }

  function GetPlaylistItem(videoId, playlistId, callback) {
    PlaylistItemResource(Auth.getAccessToken()).Get({
      part: 'snippet',
      playlistId: playlistId,
      videoId: videoId,
      maxResults: 50
    }).$promise.then(function (data) {
      if (data.items.length == 0) {
        AddPlaylistItem(videoId, playlistId, function (playlistItemId) {
          callback(playlistItemId)
        });
      } else {
        callback(data.playlistItemId);
      }
    });
  }

  function CreatePlaylist(videoId, title, callback) {
    PlaylistResource(Auth.getAccessToken()).Post({
      snippet: {
        title: title,
        tags: [title]
      },
      status: {
        privacyStatus: 'unlisted'
      }
    }).$promise.then(function (data) {
      AddPlaylistItem(videoId, data.id, function (playlistItemId) {
        callback(playlistItemId)
      });
      InsertPlaylist(videoId, data);
    });
  }

  function AddPlaylistItem(videoId, playlistId, callback) {
    PlaylistItemResource(Auth.getAccessToken()).Post({
      snippet: {
        playlistId: playlistId,
        resourceId: {
           kind: 'youtube#video',
           videoId: videoId
        }
      }
    }).$promise.then(function (data) {
      callback(data.id);
      InsertPlaylistItem(data);
      UpdatePlaylist(playlistId, function (result) {

      });
    });
  }

  function RemovePlaylistItem(playlistId, playlistItemId, callback) {
    PlaylistItemResource(Auth.getAccessToken()).Delete({
      id: playlistItemId
    }).$promise.then(function (data) {
      callback();
      DeletePlaylistItem(playlistItemId);
      UpdatePlaylist(playlistId, function (result) {

      });
    });
  }

  //************************************************

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

  function InsertPlaylistItem(data) {
    PlaylistItemDbResource.Post({
      playlistItemId: data.id,
      playlistId: data.snippet.playlistId,
      videoId: data.snippet.resourceId.videoId,
      accessToken: Auth.getAccessToken()
    });
  }

  function DeletePlaylistItem(playlistItemId) {
    PlaylistItemDbResource.Delete({
      playlistItemId: playlistItemId,
      accessToken: Auth.getAccessToken()
    });
  }

  function InsertPlaylist(videoId, data) {
    PlaylistDbResource.Post({
      playlistId: data.id,
      title: data.snippet.title,
      thumbnail: data.snippet.thumbnails.default.url,
      tags: data.snippet.tags.toString(),
      published: data.snippet.publishedAt,
      privacy: data.status.privacyStatus,
      accessToken: Auth.getAccessToken()
    });
  }

  function UpdatePlaylist(playlistId, callback) {
    PlaylistResource(Auth.getAccessToken()).Get({
      id: playlistId,
      part: 'snippet,status'
    }).$promise.then(function (data) {
      var pl = data.items[0];
      PlaylistDbResource.Put({
         playlistId: pl.id,
         title: pl.snippet.title,
         thumbnail: pl.snippet.thumbnails.default.url,
         tags: SetTags(pl),
         published: pl.snippet.publishedAt,
         privacy: pl.status.privacyStatus,
         accessToken: Auth.getAccessToken()
      }).$promise.then(function (result) {
        callback(result);
      });
    });
  }

  function SetTags(pl) {
    if (pl.snippet.tags != undefined) {
      return pl.snippet.tags.toString();
    } else {
      return '[]';
    }
  }
});
