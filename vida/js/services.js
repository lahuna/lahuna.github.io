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


//// Verify Token
//Services.factory('VerifyTokenResource',
//  function ($resource) {
//      return $resource('todo/google/verify-access-token', {}, {
//          Get: {
//              method: 'GET'
//          }
//      });
//  });

//// Refresh Token
//Services.factory('RefreshTokenResource',
//  function ($resource) {
//      return $resource('todo/google/get-refresh-token', {}, {
//          Get: {
//              method: 'GET'
//          }
//      });
//  });

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

// Get Videos All
Services.factory('VideosAllResource', ['$resource',
  function ($resource) {
      return $resource("todo/youtube/get-videos-all", {}, {
          Get: {
              method: 'GET'
          }
      });
  }]);

// Subscriptions
Services.factory('SubscriptionResource',
  function ($resource) {
      return function (accessToken) {
          return $resource("https://www.googleapis.com/youtube/v3/subscriptions", {}, {
              Get: {
                  method: 'GET',
                  headers: { "Authorization": "Bearer " + accessToken }
              },
              Subscribe: {
                  method: 'POST',
                  headers: { "Authorization": "Bearer " + accessToken },
                  params: { part: 'snippet' }
              },
              Unsubscribe: {
                  method: 'DELETE',
                  headers: { "Authorization": "Bearer " + accessToken }
              }
          });
      }
  });

//// Get Activity
//Services.factory('ActivityResource',
//  function ($resource) {
//      return function (accessToken) {
//          return $resource("https://www.googleapis.com/youtube/v3/activities", {}, {
//              Get: {
//                  method: 'GET',
//                  headers: { "Authorization": "Bearer " + accessToken }
//              }
//          });
//      }
//  });

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
Services.factory('VideoResource',
  function ($resource) {
      return function (accessToken) {
          return $resource("https://www.googleapis.com/youtube/v3/videos", {}, {
              Get: {
                  method: 'GET',
                  headers: { "Authorization": "Bearer " + accessToken },
                  params: { part: 'snippet,status,recordingDetails' }
              },
              Update: {
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
                  headers: { "Authorization": "Bearer " + accessToken },
                  params: { part: 'snippet' }
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

// Insert Playlist into DB
Services.factory('InsertPlaylistResource', ['$resource',
  function ($resource) {
      return $resource("todo/youtube/insert-playlist", {}, {
          Insert: {
              method: 'GET'
          }
      });
  }]);

// Update Playlist in DB
Services.factory('UpdatePlaylistResource', ['$resource',
  function ($resource) {
      return $resource("todo/youtube/update-playlist", {}, {
          Update: {
              method: 'GET'
          }
      });
  }]);

// Delete Playlist from DB
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

// Search Playlists
Services.factory('SearchPlaylistsResource', ['$resource',
  function ($resource) {
      return $resource("todo/youtube/get-playlists", {}, {
          Get: {
              method: 'GET'
          }
      });
  }]);

// Import Playlists
Services.factory('ImportPlaylistsResource', ['$resource',
  function ($resource) {
      return $resource("todo/youtube/import-playlists", {}, {
          Get: {
              method: 'GET'
          }
      });
  }]);

// Import PlaylistItems
Services.factory('ImportPlaylistItemsResource',
  function ($resource) {
      return $resource("todo/youtube/import-playlist-items", {}, {
          Get: {
              method: 'GET'
          }
      });
  });

// Import Videos
Services.factory('ImportVideosResource', ['$resource',
  function ($resource) {
      return $resource("todo/youtube/import-videos", {}, {
          Get: {
              method: 'GET'
          }
      });
  }]);


// Get Playlists All
Services.factory('PlaylistsAllResource', ['$resource',
  function ($resource) {
      return $resource("todo/youtube/get-playlists-all", {}, {
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

// Auto Complete
Services.factory('AutoCompleteResource', ['$resource',
  function ($resource) {
      return $resource("https://suggestqueries.google.com/complete/search", {}, {
          Get: {
              method: 'JSONP',
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

// Get Search All
Services.factory('GetSearchAllResource', ['$resource',
  function ($resource) {
      return $resource("todo/youtube/get-search-all", {}, {
          Get: {
              method: 'GET'
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

// Delete Search
Services.factory('DeleteSearchResource', ['$resource',
  function ($resource) {
      return $resource("todo/youtube/delete-search", {}, {
          Delete: {
              method: 'DELETE'
          }
      });
  }]);

//// Storage Service
//Services.factory('StorageService', function () {

//    var data;

//    var set = function (item) {
//        data = item;
//    }

//    var get = function () {
//        return data;
//    }

//    return {
//        set: set,
//        get: get
//    };
//});