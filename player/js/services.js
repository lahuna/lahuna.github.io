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
      return $resource('todo/google/authenticate', {}, {
          Get: {
              method: 'GET'
          }
      });
  });

// Search
Services.factory('SearchResource',
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

// Get Channel
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
Services.factory('VideoResource', ['$resource',
  function ($resource) {
      return function (accessToken) {
          return $resource('https://www.googleapis.com/youtube/v3/videos', {}, {
              Get: {
                  method: 'GET',
                  headers: { "Authorization": "Bearer " + accessToken },
                  params: { part: 'snippet,status' }
              },
              Update: {
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
  }]);

// Playlist
Services.factory('PlaylistResource',
  function ($resource) {
      return function (accessToken) {
          return $resource("https://www.googleapis.com/youtube/v3/playlists", {}, {
              Get: {
                  method: 'GET',
                  headers: { "Authorization": "Bearer " + accessToken },
                  params: { part: 'snippet,status' }
              },
              Create: {
                  method: 'POST',
                  headers: { "Authorization": "Bearer " + accessToken },
                  params: { part: 'snippet,status' }
              },
              Update: {
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
                  headers: { "Authorization": "Bearer " + accessToken }
              },
              Add: {
                  method: 'POST',
                  headers: { "Authorization": "Bearer " + accessToken },
                  params: { part: 'snippet' }
              },
              Move: {
                  method: 'PUT',
                  headers: { "Authorization": "Bearer " + accessToken },
                  params: { part: 'snippet' }
              },
              Remove: {
                  method: 'DELETE',
                  headers: { "Authorization": "Bearer " + accessToken }
              }
          });
      }
  });


//// Playlist Items
//Services.factory('PlaylistItemsResource', ['$resource',
//  function ($resource) {
//      return function (accessToken) {
//          return $resource('https://www.googleapis.com/youtube/v3/playlistItems', {}, {
//              Get: {
//                  method: 'GET',
//                  headers: { "Authorization": "Bearer " + accessToken }
//              }
//          });
//      }
//  }]);


// Get Playlist Items
Services.factory('GetPlaylistItemResource',
  function ($resource) {
      return $resource("todo/youtube/get-playlist-items", {}, {
          Get: {
              method: 'GET'
          }
      });
  });

// Insert Playlist Item
Services.factory('InsertPlaylistItemResource',
  function ($resource) {
      return $resource("todo/youtube/insert-playlist-item", {}, {
          Insert: {
              method: 'GET'
          }
      });
  });

// Delete Playlist
Services.factory('DeletePlaylistItemResource',
  function ($resource) {
      return $resource("todo/youtube/delete-playlist-item", {}, {
          Delete: {
              method: 'DELETE'
          }
      });
  });

// Insert Playlist
Services.factory('InsertPlaylistResource', ['$resource',
  function ($resource) {
      return $resource("todo/youtube/insert-playlist", {}, {
          Insert: {
              method: 'GET'
          }
      });
  }]);

// Update Playlist
Services.factory('UpdatePlaylistResource', ['$resource',
  function ($resource) {
      return $resource("todo/youtube/update-playlist", {}, {
          Update: {
              method: 'GET'
          }
      });
  }]);

// Delete Playlist
Services.factory('DeletePlaylistResource', ['$resource',
  function ($resource) {
      return $resource("todo/youtube/delete-playlist", {}, {
          Delete: {
              method: 'DELETE'
          }
      });
  }]);

// Get Playlist Id
Services.factory('GetPlaylistIdResource', ['$resource',
  function ($resource) {
      return $resource("todo/youtube/get-playlist-id", {}, {
          Get: {
              method: 'GET'
          }
      });
  }]);

// Get Playlist Hints
Services.factory('GetPlaylistHintsResource', ['$resource',
  function ($resource) {
      return $resource("todo/youtube/get-playlist-hints", {}, {
          Get: {
              method: 'GET',
              isArray: true
          }
      });
  }]);

// Get Search
Services.factory('GetSearchResource', ['$resource',
  function ($resource) {
      return $resource("todo/youtube/get-search", {}, {
          Get: {
              method: 'GET',
              isArray: true
          }
      });
  }]);

// Insert Search
Services.factory('InsertSearchResource', ['$resource',
  function ($resource) {
      return $resource("todo/youtube/insert-search", {}, {
          Insert: {
              method: 'GET'
          }
      });
  }]);