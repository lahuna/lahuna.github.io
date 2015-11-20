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
    return $resource(location.origin + ':8000/google/authenticate', {}, {
      Get: {
          method: 'GET'
      }
    });
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
    return $resource(location.origin + ':8000/playlist', {}, {
      Get: {
          method: 'GET'
      },
      Post: {
          method: 'POST'
      },
      Put: {
          method: 'PUT'
      },
      Delete: {
          method: 'DELETE'
      }
    });
});

// Playlist Items Db
Services.factory('PlaylistItemDbResource',
  function ($resource) {
    return $resource(location.origin + ':8000/playlist_item', {}, {
      Get: {
          method: 'GET'
      },
      Post: {
          method: 'POST'
      },
      Delete: {
          method: 'DELETE'
      }
    });
});

// Import Playlists
Services.factory('ImportPlaylistResource',
  function ($resource) {
    return $resource(location.origin + ':8000/playlist/import', {}, {
      Post: {
          method: 'POST'
      }
    });
});

// Import Playlist Items
Services.factory('ImportPlaylistItemResource',
  function ($resource) {
    return $resource(location.origin + ':8000/playlist_item/import', {}, {
      Post: {
          method: 'POST'
      }
    });
});

// Import Videos
Services.factory('ImportVideoResource',
  function ($resource) {
    return $resource(location.origin + ':8000/video/import', {}, {
      Post: {
          method: 'POST'
      }
    });
});

// Search
Services.factory('SearchResource',
  function ($resource) {
    return $resource(location.origin + ':8000/search', {}, {
      Get: {
          method: 'GET'
      },
      Post: {
          method: 'POST'
      },
      Delete: {
          method: 'DELETE'
      }
    });
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
