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

// Search Albums
Services.factory('SearchAlbumsResource',
  function ($resource) {
      return $resource("https://lahuna-need-to-fix-this/picasa/get-albums", {}, {
          Get: {
              method: 'GET'
          }
      });
  });

// Album
Services.factory('AlbumResource',
  function ($resource) {
      return $resource("https://lahuna-need-to-fix-this/picasa/get-album", {}, {
          Get: {
              method: 'GET'
          }
      });
  });

// Albums
Services.factory('AlbumsResource',
  function ($resource) {
      return $resource('https://lahuna-need-to-fix-this/picasa/get-album-type', {}, {
          GetAlbums: {
              method: 'GET'
          }
      });
  });

// Album Types
Services.factory('AlbumTypesResource',
  function ($resource) {
      return $resource('https://lahuna-need-to-fix-this/picasa/get-album-types', {}, {
          GetAlbumTypes: {
              method: 'GET'
          }
      });
  });

// Album Id
Services.factory('AlbumIdResource',
  function ($resource) {
      return $resource('https://lahuna-need-to-fix-this/picasa/get-album-id', {}, {
          GetAlbumId: {
              method: 'GET'
          }
      });
  });

// Albums Year
Services.factory('AlbumsYearResource',
  function ($resource) {
      return $resource('https://lahuna-need-to-fix-this/picasa/get-albums-year', {}, {
          GetAlbums: {
              method: 'GET'
          }
      });
  });

// Albums Month
Services.factory('AlbumsMonthResource',
  function ($resource) {
      return $resource('https://lahuna-need-to-fix-this/picasa/get-albums-month', {}, {
          GetAlbums: {
              method: 'GET'
          }
      });
  });

// Albums Day
Services.factory('AlbumsDayResource',
  function ($resource) {
      return $resource('https://lahuna-need-to-fix-this/picasa/get-albums-day', {}, {
          GetAlbums: {
              method: 'GET'
          }
      });
  });

// Album Count
//Services.factory('AlbumCountResource',
  //function ($resource) {
      //return $resource('https://lahuna-need-to-fix-this/picasa/get-album-count', {}, {
          //GetAlbumCount: {
              //method: 'GET'
          //}
      //});
  //});

// Import Albums
Services.factory('ImportAlbumResourceOLD',
  function ($resource) {
      return $resource('https://lahuna-need-to-fix-this/picasa/import-albums', {}, {
          ImportAlbums: {
              method: 'GET'
          }
      });
  });

// Import Photos
Services.factory('ImportPhotoResource',
  function ($resource) {
      return function (accessToken, refreshToken) {
          return $resource(location.origin + ':8000/photo/import', {}, {
              Post: {
                  method: 'POST',
                  headers: {
                    access_token: accessToken,
                    refresh_token: refreshToken }
              }
          });
      }
});

// Import Albums
Services.factory('ImportAlbumResource',
  function ($resource) {
      return function (accessToken, refreshToken) {
          return $resource(location.origin + ':8000/album/import', {}, {
              Post: {
                  method: 'POST',
                  headers: {
                    access_token: accessToken,
                    refresh_token: refreshToken }
              }
          });
      }
});

// Import Albums Job
Services.factory('ImportAlbumJobResource',
  function ($resource) {
      return $resource('https://lahuna-need-to-fix-this/picasa/import-albums-job', {}, {
          ImportAlbums: {
              method: 'GET'
          }
      });
  });

// Import Photos Job
Services.factory('ImportPhotoJobResource',
  function ($resource) {
      return $resource('https://lahuna-need-to-fix-this/picasa/import-photos-job', {}, {
          ImportPhotos: {
              method: 'GET'
          }
      });
  });

// Split Auto Backup
Services.factory('SplitAutoBackupResource',
  function ($resource) {
      return $resource('https://lahuna-need-to-fix-this/picasa/split-auto-backup', {}, {
          SplitAlbum: {
              method: 'GET'
          }
      });
  });


// Dup Albums
Services.factory('DupAlbumsResource',
  function ($resource) {
      return $resource('https://lahuna-need-to-fix-this/picasa/get-dup-albums', {}, {
          GetDupAlbums: {
              method: 'GET'
          }
      });
  });

// Merge Dup Albums
Services.factory('MergeDupAlbumResource',
  function ($resource) {
      return $resource('https://lahuna-need-to-fix-this/picasa/merge-dup-albums', {}, {
          MergeDupAlbums: {
              method: 'PATCH'
          }
      });
  });

// Merge Albums
Services.factory('MergeAlbumsResource',
  function ($resource) {
      return $resource('https://lahuna-need-to-fix-this/picasa/merge-albums', {}, {
          Merge: {
              method: 'PATCH'
          }
      });
  });

// Tags
Services.factory('TagsResource',
  function ($resource) {
      return $resource('https://lahuna-need-to-fix-this/picasa/get-tags?startIndex=1&maxResults=100', {}, {
          GetTags: {
              method: 'GET'
          }
      });
  });

// Album Photo List
Services.factory('AlbumPhotoListResource',
  function ($resource) {
      return $resource('https://lahuna-need-to-fix-this/picasa/get-album-photo-list', {}, {
          GetAlbumPhotos: {
              method: 'GET'
          }
      });
  });

// Album Photo Count
Services.factory('AlbumPhotoCountResource',
  function ($resource) {
      return $resource('https://lahuna-need-to-fix-this/picasa/get-album-photo-count', {}, {
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
      //return $resource('https://lahuna-need-to-fix-this/picasa/get-album-photos', {}, {
          //Get: {
              //method: 'GET'
          //}
      //});
  //});

// Update Photo
Services.factory('UpdatePhotoResource',
  function ($resource) {
      return $resource('https://lahuna-need-to-fix-this/picasa/update-photo', {}, {
          Save: {
              method: 'PATCH'
          }
      });
  });

// Update Photo Partial
Services.factory('UpdatePhotoPartialResource',
  function ($resource) {
      return $resource('https://lahuna-need-to-fix-this/picasa/update-photo-partial', {}, {
          Update: {
              method: 'PATCH'
          }
      });
  });

// Delete Photos
Services.factory('DeletePhotosResource',
  function ($resource) {
      return $resource('https://lahuna-need-to-fix-this/picasa/delete-photos', {}, {
          Delete: {
              method: 'DELETE'
          }
      });
  });

// Delete Photo
Services.factory('DeletePhotoResource',
  function ($resource) {
      return $resource('https://lahuna-need-to-fix-this/picasa/delete-photo', {}, {
          Delete: {
              method: 'DELETE'
          }
      });
  });

// Create Album
Services.factory('CreateAlbumResource',
  function ($resource) {
      return $resource('https://lahuna-need-to-fix-this/picasa/create-album', {}, {
          Save: {
              method: 'POST'
          }
      });
  });


// Update Album
Services.factory('UpdateAlbumResource',
  function ($resource) {
      return $resource('https://lahuna-need-to-fix-this/picasa/update-album', {}, {
          Save: {
              method: 'PATCH'
          }
      });
  });

// Delete Albums
Services.factory('DeleteAlbumsResource',
  function ($resource) {
      return $resource('https://lahuna-need-to-fix-this/picasa/delete-albums', {}, {
          Delete: {
              method: 'DELETE'
          }
      });
  });

// Delete Album
Services.factory('DeleteAlbumResource',
  function ($resource) {
      return $resource('https://lahuna-need-to-fix-this/picasa/delete-album', {}, {
          Delete: {
              method: 'DELETE'
          }
      });
  });

// Delete Album Confirm
Services.factory('DeleteAlbumConfirmResource',
  function ($resource) {
      return $resource('https://lahuna-need-to-fix-this/picasa/delete-album-confirm', {}, {
          Delete: {
              method: 'DELETE'
          }
      });
  });

// Search
Services.factory('SearchResource',
  function ($resource) {
      return function (accessToken) {
          return $resource(location.origin + ':8000/search', {}, {
              Get: {
                  method: 'GET',
                  //isArray:true,
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

// Get Search
//Services.factory('GetSearchResource',
  //function ($resource) {
      //return $resource("https://lahuna-need-to-fix-this/youtube/get-search", {}, {
          //Get: {
              //method: 'GET'
          //}
      //});
  //});

// Get Search All
//Services.factory('GetSearchAllResource',
  //function ($resource) {
      //return $resource("https://lahuna-need-to-fix-this/youtube/get-search-all", {}, {
          //Get: {
              //method: 'GET'
          //}
      //});
  //});

// Insert Search
//Services.factory('InsertSearchResource',
  //function ($resource) {
      //return $resource("https://lahuna-need-to-fix-this/youtube/insert-search", {}, {
          //Insert: {
              //method: 'GET'
          //}
      //});
  //});

// Delete Search
//Services.factory('DeleteSearchResource',
  //function ($resource) {
      //return $resource("https://lahuna-need-to-fix-this/youtube/delete-search", {}, {
          //Delete: {
              //method: 'DELETE'
          //}
      //});
  //});

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
