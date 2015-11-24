//*****************************************************************************************************************
// Copyright � 2014 - 2015 Lahuna. All rights reserved.
// You may not copy, reproduce, republish, disassemble, decompile, reverse engineer, post, broadcast, transmit, or
// make available to the public any content or code on this website without prior written permission from Lahuna.
//*****************************************************************************************************************

'use strict';

var fac = angular.module('ResourceFactory_Old', ['ngResource']);

// Authenticate
fac.factory('AuthenticateResource', function ($resource) {
  return $resource(location.origin + ':8000/google/authenticate', {}, {
    Get: {
      method: 'GET'
    }
  });
});

// Profile
fac.factory('ProfileResource',
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
fac.factory('SearchAlbumsResource',
  function ($resource) {
      return $resource("https://lahuna-need-to-fix-this/picasa/get-albums", {}, {
          Get: {
              method: 'GET'
          }
      });
  });

// Album
fac.factory('AlbumResource',
  function ($resource) {
      return $resource("https://lahuna-need-to-fix-this/picasa/get-album", {}, {
          Get: {
              method: 'GET'
          }
      });
  });

// Albums
fac.factory('AlbumsResource',
  function ($resource) {
      return $resource('https://lahuna-need-to-fix-this/picasa/get-album-type', {}, {
          GetAlbums: {
              method: 'GET'
          }
      });
  });

// Album Types
fac.factory('AlbumTypesResource',
  function ($resource) {
      return $resource('https://lahuna-need-to-fix-this/picasa/get-album-types', {}, {
          GetAlbumTypes: {
              method: 'GET'
          }
      });
  });

// Album Id
fac.factory('AlbumIdResource',
  function ($resource) {
      return $resource('https://lahuna-need-to-fix-this/picasa/get-album-id', {}, {
          GetAlbumId: {
              method: 'GET'
          }
      });
  });

// Albums Year
fac.factory('AlbumsYearResource',
  function ($resource) {
      return $resource('https://lahuna-need-to-fix-this/picasa/get-albums-year', {}, {
          GetAlbums: {
              method: 'GET'
          }
      });
  });

// Albums Month
fac.factory('AlbumsMonthResource',
  function ($resource) {
      return $resource('https://lahuna-need-to-fix-this/picasa/get-albums-month', {}, {
          GetAlbums: {
              method: 'GET'
          }
      });
  });

// Albums Day
fac.factory('AlbumsDayResource',
  function ($resource) {
      return $resource('https://lahuna-need-to-fix-this/picasa/get-albums-day', {}, {
          GetAlbums: {
              method: 'GET'
          }
      });
  });

// Album Count
//fac.factory('AlbumCountResource',
  //function ($resource) {
      //return $resource('https://lahuna-need-to-fix-this/picasa/get-album-count', {}, {
          //GetAlbumCount: {
              //method: 'GET'
          //}
      //});
  //});

// Import Albums
fac.factory('ImportAlbumResourceOLD',
  function ($resource) {
      return $resource('https://lahuna-need-to-fix-this/picasa/import-albums', {}, {
          ImportAlbums: {
              method: 'GET'
          }
      });
  });

// Import Photos
fac.factory('ImportPhotoResource',
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
fac.factory('ImportAlbumResource',
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
fac.factory('ImportAlbumJobResource',
  function ($resource) {
      return $resource('https://lahuna-need-to-fix-this/picasa/import-albums-job', {}, {
          ImportAlbums: {
              method: 'GET'
          }
      });
  });

// Import Photos Job
fac.factory('ImportPhotoJobResource',
  function ($resource) {
      return $resource('https://lahuna-need-to-fix-this/picasa/import-photos-job', {}, {
          ImportPhotos: {
              method: 'GET'
          }
      });
  });

// Split Auto Backup
fac.factory('SplitAutoBackupResource',
  function ($resource) {
      return $resource('https://lahuna-need-to-fix-this/picasa/split-auto-backup', {}, {
          SplitAlbum: {
              method: 'GET'
          }
      });
  });


// Dup Albums
fac.factory('DupAlbumsResource',
  function ($resource) {
      return $resource('https://lahuna-need-to-fix-this/picasa/get-dup-albums', {}, {
          GetDupAlbums: {
              method: 'GET'
          }
      });
  });

// Merge Dup Albums
fac.factory('MergeDupAlbumResource',
  function ($resource) {
      return $resource('https://lahuna-need-to-fix-this/picasa/merge-dup-albums', {}, {
          MergeDupAlbums: {
              method: 'PATCH'
          }
      });
  });

// Merge Albums
fac.factory('MergeAlbumsResource',
  function ($resource) {
      return $resource('https://lahuna-need-to-fix-this/picasa/merge-albums', {}, {
          Merge: {
              method: 'PATCH'
          }
      });
  });

// Tags
fac.factory('TagsResource',
  function ($resource) {
      return $resource('https://lahuna-need-to-fix-this/picasa/get-tags?startIndex=1&maxResults=100', {}, {
          GetTags: {
              method: 'GET'
          }
      });
  });

// Album Photo List
fac.factory('AlbumPhotoListResource',
  function ($resource) {
      return $resource('https://lahuna-need-to-fix-this/picasa/get-album-photo-list', {}, {
          GetAlbumPhotos: {
              method: 'GET'
          }
      });
  });

// Album Photo Count
fac.factory('AlbumPhotoCountResource',
  function ($resource) {
      return $resource('https://lahuna-need-to-fix-this/picasa/get-album-photo-count', {}, {
          GetAlbumPhotoCount: {
              method: 'GET'
          }
      });
  });

  // Picasa
  fac.factory('PicasaResource',
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
  fac.factory('PicasaPhotoResource',
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
  fac.factory('PicasaAlbumResource',
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
  fac.factory('PicasaAlbumFeedResource',
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
//fac.factory('AlbumPhotosResource',
  //function ($resource) {
      //return $resource('https://lahuna-need-to-fix-this/picasa/get-album-photos', {}, {
          //Get: {
              //method: 'GET'
          //}
      //});
  //});

// Update Photo
fac.factory('UpdatePhotoResource',
  function ($resource) {
      return $resource('https://lahuna-need-to-fix-this/picasa/update-photo', {}, {
          Save: {
              method: 'PATCH'
          }
      });
  });

// Update Photo Partial
fac.factory('UpdatePhotoPartialResource',
  function ($resource) {
      return $resource('https://lahuna-need-to-fix-this/picasa/update-photo-partial', {}, {
          Update: {
              method: 'PATCH'
          }
      });
  });

// Delete Photos
fac.factory('DeletePhotosResource',
  function ($resource) {
      return $resource('https://lahuna-need-to-fix-this/picasa/delete-photos', {}, {
          Delete: {
              method: 'DELETE'
          }
      });
  });

// Delete Photo
fac.factory('DeletePhotoResource',
  function ($resource) {
      return $resource('https://lahuna-need-to-fix-this/picasa/delete-photo', {}, {
          Delete: {
              method: 'DELETE'
          }
      });
  });

// Create Album
fac.factory('CreateAlbumResource',
  function ($resource) {
      return $resource('https://lahuna-need-to-fix-this/picasa/create-album', {}, {
          Save: {
              method: 'POST'
          }
      });
  });


// Update Album
fac.factory('UpdateAlbumResource',
  function ($resource) {
      return $resource('https://lahuna-need-to-fix-this/picasa/update-album', {}, {
          Save: {
              method: 'PATCH'
          }
      });
  });

// Delete Albums
fac.factory('DeleteAlbumsResource',
  function ($resource) {
      return $resource('https://lahuna-need-to-fix-this/picasa/delete-albums', {}, {
          Delete: {
              method: 'DELETE'
          }
      });
  });

// Delete Album
fac.factory('DeleteAlbumResource',
  function ($resource) {
      return $resource('https://lahuna-need-to-fix-this/picasa/delete-album', {}, {
          Delete: {
              method: 'DELETE'
          }
      });
  });

// Delete Album Confirm
fac.factory('DeleteAlbumConfirmResource',
  function ($resource) {
      return $resource('https://lahuna-need-to-fix-this/picasa/delete-album-confirm', {}, {
          Delete: {
              method: 'DELETE'
          }
      });
  });

// Search
fac.factory('SearchResource',
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
//fac.factory('GetSearchResource',
  //function ($resource) {
      //return $resource("https://lahuna-need-to-fix-this/youtube/get-search", {}, {
          //Get: {
              //method: 'GET'
          //}
      //});
  //});

// Get Search All
//fac.factory('GetSearchAllResource',
  //function ($resource) {
      //return $resource("https://lahuna-need-to-fix-this/youtube/get-search-all", {}, {
          //Get: {
              //method: 'GET'
          //}
      //});
  //});

// Insert Search
//fac.factory('InsertSearchResource',
  //function ($resource) {
      //return $resource("https://lahuna-need-to-fix-this/youtube/insert-search", {}, {
          //Insert: {
              //method: 'GET'
          //}
      //});
  //});

// Delete Search
//fac.factory('DeleteSearchResource',
  //function ($resource) {
      //return $resource("https://lahuna-need-to-fix-this/youtube/delete-search", {}, {
          //Delete: {
              //method: 'DELETE'
          //}
      //});
  //});

//// Storage Service
//fac.factory('StorageService', function () {

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
