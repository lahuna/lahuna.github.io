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
      return $resource('https://lahunaweb.azurewebsites.net/api/google/authenticate', {}, {
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

// Search Albums
Services.factory('SearchAlbumsResource',
  function ($resource) {
      return $resource("https://lahunaweb.azurewebsites.net/api/picasa/get-albums", {}, {
          Get: {
              method: 'GET'
          }
      });
  });

// Album
Services.factory('AlbumResource',
  function ($resource) {
      return $resource("https://lahunaweb.azurewebsites.net/api/picasa/get-album", {}, {
          Get: {
              method: 'GET'
          }
      });
  });

// Albums
Services.factory('AlbumsResource',
  function ($resource) {
      return $resource('https://lahunaweb.azurewebsites.net/api/picasa/get-album-type', {}, {
          GetAlbums: {
              method: 'GET'
          }
      });
  });

// Album Types
Services.factory('AlbumTypesResource',
  function ($resource) {
      return $resource('https://lahunaweb.azurewebsites.net/api/picasa/get-album-types', {}, {
          GetAlbumTypes: {
              method: 'GET'
          }
      });
  });

// Album Id
Services.factory('AlbumIdResource',
  function ($resource) {
      return $resource('https://lahunaweb.azurewebsites.net/api/picasa/get-album-id', {}, {
          GetAlbumId: {
              method: 'GET'
          }
      });
  });

// Albums Year
Services.factory('AlbumsYearResource',
  function ($resource) {
      return $resource('https://lahunaweb.azurewebsites.net/api/picasa/get-albums-year', {}, {
          GetAlbums: {
              method: 'GET'
          }
      });
  });

// Albums Month
Services.factory('AlbumsMonthResource',
  function ($resource) {
      return $resource('https://lahunaweb.azurewebsites.net/api/picasa/get-albums-month', {}, {
          GetAlbums: {
              method: 'GET'
          }
      });
  });

// Albums Day
Services.factory('AlbumsDayResource',
  function ($resource) {
      return $resource('https://lahunaweb.azurewebsites.net/api/picasa/get-albums-day', {}, {
          GetAlbums: {
              method: 'GET'
          }
      });
  });

// Album Count
//Services.factory('AlbumCountResource',
  //function ($resource) {
      //return $resource('https://lahunaweb.azurewebsites.net/api/picasa/get-album-count', {}, {
          //GetAlbumCount: {
              //method: 'GET'
          //}
      //});
  //});

// Import Albums
Services.factory('ImportAlbumResource',
  function ($resource) {
      return $resource('https://lahunaweb.azurewebsites.net/api/picasa/import-albums', {}, {
          ImportAlbums: {
              method: 'GET'
          }
      });
  });

// Import Photos
Services.factory('ImportPhotoResource',
  function ($resource) {
      return $resource('https://lahunaweb.azurewebsites.net/api/picasa/import-photos', {}, {
          ImportPhotos: {
              method: 'GET'
          }
      });
  });

// Import Albums All
Services.factory('ImportAlbumsAllResource',
  function ($resource) {
      return $resource('https://lahunaweb.azurewebsites.net/api/picasa/import-albums-all', {}, {
          ImportAlbums: {
              method: 'GET'
          }
      });
  });

// Import Albums Job
Services.factory('ImportAlbumJobResource',
  function ($resource) {
      return $resource('https://lahunaweb.azurewebsites.net/api/picasa/import-albums-job', {}, {
          ImportAlbums: {
              method: 'GET'
          }
      });
  });

// Import Photos Job
Services.factory('ImportPhotoJobResource',
  function ($resource) {
      return $resource('https://lahunaweb.azurewebsites.net/api/picasa/import-photos-job', {}, {
          ImportPhotos: {
              method: 'GET'
          }
      });
  });

// Split Auto Backup
Services.factory('SplitAutoBackupResource',
  function ($resource) {
      return $resource('https://lahunaweb.azurewebsites.net/api/picasa/split-auto-backup', {}, {
          SplitAlbum: {
              method: 'GET'
          }
      });
  });


// Dup Albums
Services.factory('DupAlbumsResource',
  function ($resource) {
      return $resource('https://lahunaweb.azurewebsites.net/api/picasa/get-dup-albums', {}, {
          GetDupAlbums: {
              method: 'GET'
          }
      });
  });

// Merge Dup Albums
Services.factory('MergeDupAlbumResource',
  function ($resource) {
      return $resource('https://lahunaweb.azurewebsites.net/api/picasa/merge-dup-albums', {}, {
          MergeDupAlbums: {
              method: 'PATCH'
          }
      });
  });

// Merge Albums
Services.factory('MergeAlbumsResource',
  function ($resource) {
      return $resource('https://lahunaweb.azurewebsites.net/api/picasa/merge-albums', {}, {
          Merge: {
              method: 'PATCH'
          }
      });
  });

// Tags
Services.factory('TagsResource',
  function ($resource) {
      return $resource('https://lahunaweb.azurewebsites.net/api/picasa/get-tags?startIndex=1&maxResults=100', {}, {
          GetTags: {
              method: 'GET'
          }
      });
  });

// Album Photo List
Services.factory('AlbumPhotoListResource',
  function ($resource) {
      return $resource('https://lahunaweb.azurewebsites.net/api/picasa/get-album-photo-list', {}, {
          GetAlbumPhotos: {
              method: 'GET'
          }
      });
  });

// Album Photo Count
Services.factory('AlbumPhotoCountResource',
  function ($resource) {
      return $resource('https://lahunaweb.azurewebsites.net/api/picasa/get-album-photo-count', {}, {
          GetAlbumPhotoCount: {
              method: 'GET'
          }
      });
  });

  // Picasa
  Services.factory('PicasaResource',
    function ($resource) {
        return function (accessToken) {
            return $resource(location.origin + ':8000/data/feed/api/user/default', {}, {
                Get: {
                    method: 'GET',
                    headers: {
                      desthost: 'https://picasaweb.google.com',
                      authorization: 'Bearer ' + accessToken }
                }
            });
        }
    });

  // Picasa Photo
  Services.factory('PicasaPhotoResource',
    function ($resource) {
        return function (photoId, accessToken) {
            return $resource(location.origin + ':8000/data/entry/api/user/default/photoid/' + photoId, {}, {
                Get: {
                    method: 'GET',
                    headers: {
                      desthost: 'https://picasaweb.google.com',
                      authorization: 'Bearer ' + accessToken }
                }
            });
        }
    });

  // Picasa Album
  Services.factory('PicasaAlbumResource',
    function ($resource) {
        return function (albumId, accessToken) {
            return $resource(location.origin + ':8000/data/entry/api/user/default/albumid/' + albumId, {}, {
                Get: {
                    method: 'GET',
                    headers: {
                      desthost: 'https://picasaweb.google.com',
                      authorization: 'Bearer ' + accessToken }
                }
            });
        }
    });

  // Picasa Album Feed
  Services.factory('PicasaAlbumFeedResource',
    function ($resource) {
        return function (albumId, accessToken) {
            return $resource(location.origin + ':8000/data/feed/api/user/default/albumid/' + albumId, {}, {
                Get: {
                    method: 'GET',
                    headers: {
                      desthost: 'https://picasaweb.google.com',
                      authorization: 'Bearer ' + accessToken }
                }
            });
        }
    });

// Album Photos
//Services.factory('AlbumPhotosResource',
  //function ($resource) {
      //return $resource('https://lahunaweb.azurewebsites.net/api/picasa/get-album-photos', {}, {
          //Get: {
              //method: 'GET'
          //}
      //});
  //});

// Update Photo
Services.factory('UpdatePhotoResource',
  function ($resource) {
      return $resource('https://lahunaweb.azurewebsites.net/api/picasa/update-photo', {}, {
          Save: {
              method: 'PATCH'
          }
      });
  });

// Update Photo Partial
Services.factory('UpdatePhotoPartialResource',
  function ($resource) {
      return $resource('https://lahunaweb.azurewebsites.net/api/picasa/update-photo-partial', {}, {
          Update: {
              method: 'PATCH'
          }
      });
  });

// Delete Photos
Services.factory('DeletePhotosResource',
  function ($resource) {
      return $resource('https://lahunaweb.azurewebsites.net/api/picasa/delete-photos', {}, {
          Delete: {
              method: 'DELETE'
          }
      });
  });

// Delete Photo
Services.factory('DeletePhotoResource',
  function ($resource) {
      return $resource('https://lahunaweb.azurewebsites.net/api/picasa/delete-photo', {}, {
          Delete: {
              method: 'DELETE'
          }
      });
  });

// Create Album
Services.factory('CreateAlbumResource',
  function ($resource) {
      return $resource('https://lahunaweb.azurewebsites.net/api/picasa/create-album', {}, {
          Save: {
              method: 'POST'
          }
      });
  });


// Update Album
Services.factory('UpdateAlbumResource',
  function ($resource) {
      return $resource('https://lahunaweb.azurewebsites.net/api/picasa/update-album', {}, {
          Save: {
              method: 'PATCH'
          }
      });
  });

// Delete Albums
Services.factory('DeleteAlbumsResource',
  function ($resource) {
      return $resource('https://lahunaweb.azurewebsites.net/api/picasa/delete-albums', {}, {
          Delete: {
              method: 'DELETE'
          }
      });
  });

// Delete Album
Services.factory('DeleteAlbumResource',
  function ($resource) {
      return $resource('https://lahunaweb.azurewebsites.net/api/picasa/delete-album', {}, {
          Delete: {
              method: 'DELETE'
          }
      });
  });

// Delete Album Confirm
Services.factory('DeleteAlbumConfirmResource',
  function ($resource) {
      return $resource('https://lahunaweb.azurewebsites.net/api/picasa/delete-album-confirm', {}, {
          Delete: {
              method: 'DELETE'
          }
      });
  });

// Get Search
Services.factory('GetSearchResource',
  function ($resource) {
      return $resource("https://lahunaweb.azurewebsites.net/api/youtube/get-search", {}, {
          Get: {
              method: 'GET',
              isArray: true
          }
      });
  });

// Get Search All
Services.factory('GetSearchAllResource',
  function ($resource) {
      return $resource("https://lahunaweb.azurewebsites.net/api/youtube/get-search-all", {}, {
          Get: {
              method: 'GET'
          }
      });
  });

// Insert Search
Services.factory('InsertSearchResource',
  function ($resource) {
      return $resource("https://lahunaweb.azurewebsites.net/api/youtube/insert-search", {}, {
          Insert: {
              method: 'GET'
          }
      });
  });

// Delete Search
Services.factory('DeleteSearchResource',
  function ($resource) {
      return $resource("https://lahunaweb.azurewebsites.net/api/youtube/delete-search", {}, {
          Delete: {
              method: 'DELETE'
          }
      });
  });

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
