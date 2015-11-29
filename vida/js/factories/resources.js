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

// Youtube Search
fac.factory('YoutubeSearchResource', function ($resource) {
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
fac.factory('SubscriptionResource', function ($resource) {
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
fac.factory('ChannelResource', function ($resource) {
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
fac.factory('VideoResource', function ($resource) {
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
fac.factory('PlaylistResource', function ($resource) {
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
fac.factory('PlaylistItemResource', function ($resource) {
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
fac.factory('PlaylistDbResource', function ($resource) {
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
fac.factory('PlaylistItemDbResource', function ($resource) {
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
fac.factory('ImportPlaylistResource', function ($resource) {
  return $resource(location.origin + ':8000/playlist/import', {}, {
    Post: {
      method: 'POST'
    }
  });
});

// Import Playlist Items
fac.factory('ImportPlaylistItemResource', function ($resource) {
  return $resource(location.origin + ':8000/playlist_item/import', {}, {
    Post: {
      method: 'POST'
    }
  });
});

// Import Videos
fac.factory('ImportVideoResource', function ($resource) {
  return $resource(location.origin + ':8000/video/import', {}, {
    Post: {
      method: 'POST'
    }
  });
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

// Auto Complete
fac.factory('AutoCompleteResource', function ($resource) {
  return $resource("https://suggestqueries.google.com/complete/search", {}, {
    Get: {
      method: 'JSONP',
      isArray: true
    }
  });
});
