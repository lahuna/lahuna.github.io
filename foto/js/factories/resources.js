//*****************************************************************************************************************
// Copyright � 2014 - 2015 Lahuna. All rights reserved.
// You may not copy, reproduce, republish, disassemble, decompile, reverse engineer, post, broadcast, transmit, or
// make available to the public any content or code on this website without prior written permission from Lahuna.
//*****************************************************************************************************************

'use strict';

var fac = angular.module('ResourceFactory', ['ngResource']);

// Authenticate
fac.factory('AuthenticateResource', function ($resource) {
  return $resource(location.origin + ':8000/google/authenticate', {}, {
    Get: {
      method: 'GET'
    }
  });
});

// Profile
fac.factory('ProfileResource', function ($resource) {
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
fac.factory('AlbumDbResource', function ($resource) {
  return $resource(location.origin + ':8000/album', {}, {
    Get: {
      method: 'GET'
    }
  });
});

// Import Photos
fac.factory('ImportPhotoResource', function ($resource) {
  return $resource(location.origin + ':8000/photo/import', {}, {
    Post: {
      method: 'POST'
    }
  });
});

// Import Albums
fac.factory('ImportAlbumResource', function ($resource) {
  return $resource(location.origin + ':8000/album/import', {}, {
    Post: {
      method: 'POST'
    }
  });
});

// Picasa
fac.factory('PicasaResource', function ($resource) {
  var resource = 'https://picasaweb.google.com/data/feed/api/user/default';
  return $resource(location.origin + ':8000/other', {}, {
    Get: {
      method: 'GET',
      params: { resource: resource }
    }
  });
});

// Picasa Photo
fac.factory('PicasaPhotoResource', function ($resource) {
  return function (photoId) {
    var resource = 'https://picasaweb.google.com/data/entry/api/user/default/photoid/' + photoId;
    return $resource(location.origin + ':8000/other', {}, {
      Get: {
        method: 'GET',
        params: { resource: resource }
      }
    });
  }
});

// Picasa Album
fac.factory('PicasaAlbumResource', function ($resource) {
  return function (albumId) {
    var resource = 'https://picasaweb.google.com/data/entry/api/user/default/albumid/' + albumId;
    return $resource(location.origin + ':8000/other', {}, {
      Get: {
        method: 'GET',
        params: { resource: resource }
      }
    });
  }
});

// Picasa Album Feed
fac.factory('PicasaAlbumFeedResource', function ($resource) {
  return function (albumId) {
    var resource = 'https://picasaweb.google.com/data/feed/api/user/default/albumid/' + albumId;
    return $resource(location.origin + ':8000/other', {}, {
      Get: {
        method: 'GET',
        params: { resource: resource }
      }
    });
  }
});

// Search
fac.factory('SearchResource', function ($resource) {
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
