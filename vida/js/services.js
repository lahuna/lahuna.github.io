//*****************************************************************************************************************
// Copyright � 2014 - 2015 Lahuna. All rights reserved.
// You may not copy, reproduce, republish, disassemble, decompile, reverse engineer, post, broadcast, transmit, or
// make available to the public any content or code on this website without prior written permission from Lahuna.
//*****************************************************************************************************************

'use strict';

/* Services */

var Services = angular.module('Services', ['ngResource']);

// Authenticate
Services.factory('AuthenticateResource',
  function ($resource) {
      return function (accessToken, refreshToken) {
          return $resource(location.origin + ':8000/google/authenticate', {}, {
              Get: {
                  method: 'GET',
                  headers: {
                    access_token: accessToken,
                    refresh_token: refreshToken }
              }
          });
      }
});

// Profile
Services.factory('ProfileResource',
  function ($resource) {
      return function (accessToken) {
          return $resource('https://www.googleapis.com/plus/v1/people/me', {}, {
              Get: {
                  method: 'GET',
                  headers: { "Authorization": "Bearer " + accessToken }
              }
          });
      }
});

// Youtube Search
Services.factory('YoutubeSearchResource',
  function ($resource) {
      return function (accessToken) {
          return $resource("https://www.googleapis.com/youtube/v3/search", {}, {
              Get: {
                  method: 'GET',
                  headers: { "Authorization": "Bearer " + accessToken }
              }
          });
      }
});

// Subscriptions
Services.factory('SubscriptionResource',
  function ($resource) {
      return function (accessToken) {
          return $resource("https://www.googleapis.com/youtube/v3/subscriptions", {}, {
              Get: {
                  method: 'GET',
                  headers: { "Authorization": "Bearer " + accessToken }
              },
              Post: {
                  method: 'POST',
                  headers: { "Authorization": "Bearer " + accessToken },
                  params: { part: 'snippet' }
              },
              Delete: {
                  method: 'DELETE',
                  headers: { "Authorization": "Bearer " + accessToken }
              }
          });
      }
});

// Channel
Services.factory('ChannelResource',
  function ($resource) {
      return function (accessToken) {
          return $resource("https://www.googleapis.com/youtube/v3/channels", {}, {
              Get: {
                  method: 'GET',
                  headers: { "Authorization": "Bearer " + accessToken }
              }
          });
      }
});

// Video
Services.factory('VideoResource',
  function ($resource) {
      return function (accessToken) {
          return $resource("https://www.googleapis.com/youtube/v3/videos", {}, {
              Get: {
                  method: 'GET',
                  headers: { "Authorization": "Bearer " + accessToken },
              },
              Put: {
                  method: 'PUT',
                  headers: { "Authorization": "Bearer " + accessToken },
                  params: { part: 'snippet,status,recordingDetials' }
              },
              Delete: {
                  method: 'DELETE',
                  headers: { "Authorization": "Bearer " + accessToken }
              }
          });
      }
});

// Playlist
Services.factory('PlaylistResource',
  function ($resource) {
      return function (accessToken) {
          return $resource("https://www.googleapis.com/youtube/v3/playlists", {}, {
              Get: {
                  method: 'GET',
                  headers: { "Authorization": "Bearer " + accessToken },
              },
              Post: {
                  method: 'POST',
                  headers: { "Authorization": "Bearer " + accessToken },
                  params: { part: 'snippet,status' }
              },
              Put: {
                  method: 'PUT',
                  headers: { "Authorization": "Bearer " + accessToken },
                  params: { part: 'snippet,status' }
              },
              Delete: {
                  method: 'DELETE',
                  headers: { "Authorization": "Bearer " + accessToken }
              }
          });
      }
});

// Playlist Items
Services.factory('PlaylistItemResource',
  function ($resource) {
      return function (accessToken) {
          return $resource("https://www.googleapis.com/youtube/v3/playlistItems", {}, {
              Get: {
                  method: 'GET',
                  headers: { "Authorization": "Bearer " + accessToken },
              },
              Post: {
                  method: 'POST',
                  headers: { "Authorization": "Bearer " + accessToken },
                  params: { part: 'snippet' }
              },
              Put: {
                  method: 'PUT',
                  headers: { "Authorization": "Bearer " + accessToken },
                  params: { part: 'snippet' }
              },
              Delete: {
                  method: 'DELETE',
                  headers: { "Authorization": "Bearer " + accessToken }
              }
          });
      }
});

// Playlists Db
Services.factory('PlaylistDbResource',
  function ($resource) {
      return function (accessToken) {
          return $resource(location.origin + ':8000/playlist', {}, {
              Get: {
                  method: 'GET',
                  isArray:true,
                  headers: { 'access_token': accessToken }
              },
              Post: {
                  method: 'POST',
                  headers: { 'access_token': accessToken }
              },
              Put: {
                  method: 'PUT',
                  headers: { 'access_token': accessToken }
              },
              Delete: {
                  method: 'DELETE',
                  headers: { 'access_token': accessToken }
              }
          });
      }
});

// Playlist Items Db
Services.factory('PlaylistItemDbResource',
  function ($resource) {
      return function (accessToken) {
          return $resource(location.origin + ':8000/playlist_item', {}, {
              Get: {
                  method: 'GET',
                  isArray:true,
                  headers: { 'access_token': accessToken }
              },
              Post: {
                  method: 'POST',
                  headers: { 'access_token': accessToken }
              },
              Delete: {
                  method: 'DELETE',
                  headers: { 'access_token': accessToken }
              }
          });
      }
});

// Import Playlists
Services.factory('ImportPlaylistResource',
  function ($resource) {
      return function (accessToken, refreshToken) {
          return $resource(location.origin + ':8000/playlist/import', {}, {
              Post: {
                  method: 'POST',
                  headers: {
                    access_token: accessToken,
                    refresh_token: refreshToken }
              }
          });
      }
});

// Import Playlist Items
Services.factory('ImportPlaylistItemResource',
  function ($resource) {
      return function (accessToken, refreshToken) {
          return $resource(location.origin + ':8000/playlist_item/import', {}, {
              Post: {
                  method: 'POST',
                  headers: {
                    access_token: accessToken,
                    refresh_token: refreshToken }
              }
          });
      }
});

// Import Videos
Services.factory('ImportVideoResource',
  function ($resource) {
      return function (accessToken, refreshToken) {
          return $resource(location.origin + ':8000/video/import', {}, {
              Post: {
                  method: 'POST',
                  headers: {
                    access_token: accessToken,
                    refresh_token: refreshToken }
              }
          });
      }
});

// Search
Services.factory('SearchResource',
  function ($resource) {
      return function (accessToken) {
          return $resource(location.origin + ':8000/search', {}, {
              Get: {
                  method: 'GET',
                  isArray:true,
                  headers: { 'access_token': accessToken }
              },
              Post: {
                  method: 'POST',
                  headers: { 'access_token': accessToken }
              },
              Delete: {
                  method: 'DELETE',
                  headers: { 'access_token': accessToken }
              }
          });
      }
});

// Auto Complete
Services.factory('AutoCompleteResource',
  function ($resource) {
      return $resource("https://suggestqueries.google.com/complete/search", {}, {
          Get: {
              method: 'JSONP',
              isArray: true
          }
      });
});
