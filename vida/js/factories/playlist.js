//*****************************************************************************************************************
// Copyright � 2014 - 2015 Lahuna. All rights reserved.
// You may not copy, reproduce, republish, disassemble, decompile, reverse engineer, post, broadcast, transmit, or
// make available to the public any content or code on this website without prior written permission from Lahuna.
//*****************************************************************************************************************

'use strict';

var fac = angular.module('PlaylistFactory', ['ResourceFactory', 'AuthenticateFactory']);

fac.factory('Playlist', function (Auth, PlaylistDbResource,
  PlaylistResource, PlaylistItemDbResource, PlaylistItemResource,
  VideoResource, VideoDbResource) {

  return { 'AddToPlaylist': AddToPlaylist,
           'UpdatePlaylist': UpdatePlaylist,
           'UpdateVideo': UpdateVideo};

   function GetAccessToken() {
     return localStorage.getItem('youtube_access_token');
   }

  function AddToPlaylist(video, title, callback) {
    GetPlaylistId(video, title, function (playlistId, playlistItemId) {
      return callback(playlistId, playlistItemId);
    });
  }

  function GetPlaylistId(video, title, callback) {
   var videoId = GetVideoId(video);
   PlaylistDbResource.Get({
     title: title,
     accessToken: GetAccessToken(),
     maxdocs: 1
   }).$promise.then(function (data) {
       if (data.list.length > 0) {
         var plid = data.list[0].playlistId;
         if (video.playlistItemId) {
           RemovePlaylistItem(plid, video.playlistItemId, function () {
             return callback(plid, null);
           });
         } else {
           GetPlaylistItem(videoId, plid, function (playlistItemId) {
             callback(plid, playlistItemId);
           });
         }
       } else {
         CreatePlaylist(videoId, title, function (playlistId, playlistItemId) {
          callback(playlistId, playlistItemId);
         });
       }
   });
  }

  function GetPlaylistItem(videoId, playlistId, callback) {
    PlaylistItemResource(GetAccessToken()).Get({
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
    PlaylistResource(GetAccessToken()).Post({
      snippet: {
        title: title,
        tags: [title]
      },
      status: {
        privacyStatus: 'unlisted'
      }
    }).$promise.then(function (data) {
      AddPlaylistItem(videoId, data.id, function (playlistItemId) {
        callback(data.id, playlistItemId)
      });
      InsertPlaylist(videoId, data);
    });
  }

  function AddPlaylistItem(videoId, playlistId, callback) {
    PlaylistItemResource(GetAccessToken()).Post({
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
    PlaylistItemResource(GetAccessToken()).Delete({
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
      accessToken: GetAccessToken()
    });
  }

  function DeletePlaylistItem(playlistItemId) {
    PlaylistItemDbResource.Delete({
      playlistItemId: playlistItemId,
      accessToken: GetAccessToken()
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
      accessToken: GetAccessToken()
    });
  }

  function UpdatePlaylist(playlistId, callback) {
    PlaylistResource(GetAccessToken()).Get({
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
         accessToken: GetAccessToken()
      }).$promise.then(function (result) {
        callback(result);
      });
    });
  }

  function UpdateVideo(videoId, callback) {
    VideoResource(GetAccessToken()).Get({
      id: videoId,
      part: 'snippet,status'
    }).$promise.then(function (data) {
      var v = data.items[0];
      VideoDbResource.Put({
         videoId: v.id,
         title: v.snippet.title,
         thumbnail: v.snippet.thumbnails.default.url,
         tags: SetTags(v),
         published: v.snippet.publishedAt,
         privacy: v.status.privacyStatus,
         accessToken: GetAccessToken()
      }).$promise.then(function (result) {
        callback(result);
      });
    });
  }

  function SetTags(item) {
    if (item.snippet.tags) {
      return item.snippet.tags.toString();
    } else {
      return '[]';
    }
  }
});
