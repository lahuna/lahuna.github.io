//*****************************************************************************************************************
// Copyright 2014 - 2017 Lahuna. All rights reserved.
// You may not copy, reproduce, republish, disassemble, decompile, reverse engineer, post, broadcast, transmit, or
// make available to the public any content or code on this website without prior written permission from Lahuna.
//*****************************************************************************************************************

'use strict';

var fac = angular.module('ResourceFactory', ['ngResource']);

// Authenticate
fac.factory('AuthenticateResource', function ($resource) {
  return $resource('https://lahuna.net/google/authenticate', {}, {
    Get: {
      method: 'GET'
    }
  });
});


// Blogger Get Posts
fac.factory('BloggerGetPostsResource', function ($resource) {
  return function (accessToken) {
    return $resource('https://www.googleapis.com/blogger/v3/blogs/@blogId/posts/', {}, {
      Get: {
        method: 'Get',
        headers: { "Authorization": "Bearer " + accessToken }
      }
    });
  }
});

// Blogger Get Blogs
fac.factory('BloggerGetResource', function ($resource) {
  return function (accessToken) {
    return $resource('https://www.googleapis.com/blogger/v3/users/self/blogs', {}, {
      Get: {
        method: 'Get',
        headers: { "Authorization": "Bearer " + accessToken }
      }
    });
  }
});

// Blogger Post
fac.factory('BloggerPostResource', function ($resource) {
  return function (accessToken) {
    return $resource('https://www.googleapis.com/blogger/v3/blogs/@blogId/posts/', {}, {
      Post: {
        method: 'POST',
        params: { blogId: '@blogId' },
        headers: {
            "Authorization": "Bearer " + accessToken,
            "Content-Type": "application/json"
        }
      }
    });
  }
});

// Google Refresh Token
fac.factory('GoogleRefreshTokenResource', function ($resource) {
  return $resource('https://lahuna.net/google/refresh_token', {}, {
    Post: {
      method: 'POST'
    }
  });
});

// Google Profile
fac.factory('GoogleProfileResource', function ($resource) {
  return function (accessToken) {
    return $resource('https://www.googleapis.com/plus/v1/people/me', {}, {
      Get: {
        method: 'GET',
        headers: { "Authorization": "Bearer " + accessToken }
      }
    });
  }
});

// Facebook Profile
fac.factory('FacebookProfileResource', function ($resource) {
  return $resource('https://graph.facebook.com/me', {}, {
    Get: {
        method: 'GET'
    }
  });
});

// Facebook Posts
fac.factory('FacebookPostsResource', function ($resource) {
  return $resource('https://graph.facebook.com/me/posts', {}, {
    Get: {
      method: 'GET'
    }
  });
});

// Facebook Albums
fac.factory('FacebookAlbumsResource', function ($resource) {
  return $resource('https://graph.facebook.com/me/albums', {}, {
    Get: {
      method: 'GET'
    }
  });
});

// Facebook Photos
fac.factory('FacebookPhotosResource', function ($resource) {
  return $resource('https://graph.facebook.com/me/photos/uploaded', {}, {
    Get: {
      method: 'GET'
    }
  });
});

// Facebook Videos
fac.factory('FacebookVideosResource', function ($resource) {
  return $resource('https://graph.facebook.com/me/videos/uploaded', {}, {
    Get: {
      method: 'GET'
    }
  });
});

// Facebook Accounts
fac.factory('FacebookAccountsResource', function ($resource) {
  return $resource('https://graph.facebook.com/me/accounts', {}, {
    Get: {
      method: 'GET'
    }
  });
});

// Facebook Post
fac.factory('FacebookPostResource', function ($resource) {
  return $resource('https://graph.facebook.com/me/feed', {}, {
    Post: {
      method: 'POST',
      params: { message: '@message', link: '@link', access_token: '@access_token' },
      error: function (error)
      {
        return error.message
      }
    }
  });
});

// Imgur Profile
fac.factory('ImgurProfileResource', function ($resource) {
  return function (accessToken, userName) {;
    return $resource('https://api.imgur.com/3/account/' + userName, {}, {
      Get: {
        method: 'GET',
        headers: { "Authorization": "Bearer " + accessToken }
      }
    });
  }
});

// Imgur Post
fac.factory('ImgurPostResource', function ($resource) {
  return function (accessToken) {
    return $resource('https://api.imgur.com/3/image', {}, {
      Post: {
        method: 'POST',
        headers: { "Authorization": "Bearer " + accessToken }
      }
    });
  }
});

// Imgur Refresh Token
fac.factory('ImgurRefreshTokenResource', function ($resource) {
  return $resource('https://lahuna.net/imgur/refresh_token', {}, {
    Post: {
      method: 'POST'
    }
  });
});

// Reddit Access Token
fac.factory('RedditAccessTokenResource', function ($resource) {
  return $resource('https://lahuna.net/reddit/access_token', {}, {
    Post: {
      method: 'POST'
    }
  });
});

// Reddit Refresh Token
fac.factory('RedditRefreshTokenResource', function ($resource) {
  return $resource('https://lahuna.net/reddit/refresh_token', {}, {
    Post: {
      method: 'POST'
    }
  });
});

// Reddit Profile
fac.factory('RedditProfileResource', function ($resource) {
  return $resource('https://lahuna.net/reddit/profile', {}, {
    Get: {
      method: 'GET'
    }
  });
});

// Reddit Post
fac.factory('RedditPostResource', function ($resource) {
  return function (accessToken) {
    return $resource('https://lahuna.net/reddit/post', {}, {
      Post: {
        method: 'POST',
        params: {
          accessToken: accessToken,
          category: '@category',
          type: '@type',
          title: '@title',
          body: '@body'
        }
      }
    });
  }
});

// LinkedIn Access Token
fac.factory('LinkedInAccessTokenResource', function ($resource) {
  return $resource('https://lahuna.net/linkedin/access_token', {}, {
    Post: {
      method: 'POST'
    }
  });
});

// LinkedIn Profile
fac.factory('LinkedInProfileResource', function ($resource) {
  return $resource('https://lahuna.net/linkedin/profile', {}, {
    Get: {
      method: 'GET'
    }
  });
});

// LinkedIn Post
fac.factory('LinkedInPostResource', function ($resource) {
  return $resource('https://lahuna.net/linkedin/post', {}, {
    Post: {
      method: 'POST'
    }
  });
});

// Twitter Request Token
fac.factory('TwitterRequestTokenResource', function ($resource) {
  return $resource('https://lahuna.net/twitter/request_token', {}, {
    Post: {
      method: 'POST'
    }
  });
});

// Twitter Access Token
fac.factory('TwitterAccessTokenResource', function ($resource) {
  return $resource('https://lahuna.net/twitter/access_token', {}, {
    Post: {
      method: 'POST'
    }
  });
});

// Twitter Profile
fac.factory('TwitterProfileResource', function ($resource) {
  return $resource('https://lahuna.net/twitter/profile', {}, {
    Get: {
      method: 'GET'
    }
  });
});

// Twitter Post
fac.factory('TwitterPostResource', function ($resource) {
  return $resource('https://lahuna.net/twitter/post', {}, {
    Post: {
      method: 'POST'
    }
  });
});

// Tumblr Request Token
fac.factory('TumblrRequestTokenResource', function ($resource) {
    return $resource('https://lahuna.net/tumblr/request_token', {}, {
      Post: {
        method: 'POST'
      }
    });
});

// Tumblr Access Token
fac.factory('TumblrAccessTokenResource', function ($resource) {
  return $resource('https://lahuna.net/tumblr/access_token', {}, {
    Post: {
      method: 'POST'
    }
  });
});

// Tumblr Profile
fac.factory('TumblrProfileResource', function ($resource) {
  return $resource('https://lahuna.net/tumblr/profile', {}, {
    Get: {
      method: 'GET'
    }
  });
});

// Tumblr Post
fac.factory('TumblrPostResource', function ($resource) {
  return $resource('https://lahuna.net/tumblr/post', {}, {
    Post: {
      method: 'POST'
    }
  });
});
