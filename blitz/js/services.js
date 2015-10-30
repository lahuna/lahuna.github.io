//*****************************************************************************************************************
// Copyright � 2014 - 2015 Lahuna. All rights reserved.
// You may not copy, reproduce, republish, disassemble, decompile, reverse engineer, post, broadcast, transmit, or
// make available to the public any content or code on this website without prior written permission from Lahuna.
//*****************************************************************************************************************

'use strict';

/* Services */

var Services = angular.module('Services', ['ngResource']);

// Get Api
Services.factory('GetApiResource', ['$resource',
  function ($resource) {
      return $resource('https://lahunaweb.azurewebsites.net/api/common/get-api', {}, {
          Get: {
              method: 'GET'
          }
      });
  }]);

// Blogger Get Posts
Services.factory('BloggerGetPostsResource',
  function ($resource) {
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
Services.factory('BloggerGetResource',
  function ($resource) {
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
Services.factory('BloggerPostResource',
  function ($resource) {
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

//// Google Access Token
//Services.factory('GoogleAccessTokenResource', ['$resource',
//  function ($resource) {
//      return $resource('https://lahunaweb.azurewebsites.net/api/google/get-access-token', {}, {
//          Get: {
//              method: 'GET'
//          }
//      });
//  }]);

// Google Refresh Token
Services.factory('GoogleRefreshTokenResource',
  function ($resource) {
      return $resource('https://lahunaweb.azurewebsites.net/api/google/get-refresh-token', {}, {
          Get: {
              method: 'GET'
          }
      });
  });

// Google Profile
Services.factory('GoogleProfileResource',
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

// Facebook Profile
Services.factory('FacebookProfileResource', ['$resource',
  function ($resource) {
      return $resource('https://graph.facebook.com/me', {}, {
          Get: {
              method: 'GET'
          }
      });
  }]);

// Facebook Posts
Services.factory('FacebookPostsResource', ['$resource',
  function ($resource) {
      return $resource('https://graph.facebook.com/me/posts', {}, {
          Get: {
              method: 'GET'
          }
      });
  }]);

// Facebook Albums
Services.factory('FacebookAlbumsResource', ['$resource',
  function ($resource) {
      return $resource('https://graph.facebook.com/me/albums', {}, {
          Get: {
              method: 'GET'
          }
      });
  }]);

// Facebook Photos
Services.factory('FacebookPhotosResource', ['$resource',
  function ($resource) {
      return $resource('https://graph.facebook.com/me/photos/uploaded', {}, {
          Get: {
              method: 'GET'
          }
      });
  }]);

// Facebook Videos
Services.factory('FacebookVideosResource', ['$resource',
  function ($resource) {
      return $resource('https://graph.facebook.com/me/videos/uploaded', {}, {
          Get: {
              method: 'GET'
          }
      });
  }]);

// Facebook Accounts
Services.factory('FacebookAccountsResource', ['$resource',
  function ($resource) {
      return $resource('https://graph.facebook.com/me/accounts', {}, {
          Get: {
              method: 'GET'
          }
      });
  }]);

// Facebook Post
Services.factory('FacebookPostResource', ['$resource',
  function ($resource) {
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
  }]);

// Imgur Profile
Services.factory('ImgurProfileResource',
  function ($resource) {
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
Services.factory('ImgurPostResource',
  function ($resource) {
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
Services.factory('ImgurRefreshTokenResource',
  function ($resource) {
      return $resource(location.origin + ':8000/imgur/refresh_token', {}, {
          Post: {
              method: 'POST'
          }
      });
  });

// Reddit Access Token
Services.factory('RedditAccessTokenResource', ['$resource',
  function ($resource) {
      return $resource(location.origin + ':8000/reddit/access_token', {}, {
          Post: {
              method: 'POST'
          }
      });
  }]);

// Reddit Refresh Token
Services.factory('RedditRefreshTokenResource', ['$resource',
  function ($resource) {
      return $resource(location.origin + ':8000/reddit/refresh_token', {}, {
          Post: {
              method: 'POST'
          }
      });
  }]);

// Reddit Profile
Services.factory('RedditProfileResource',
  function ($resource) {
      return function (accessToken) {
          return $resource(location.origin + ':8000/reddit/profile', {}, {
              Get: {
                  method: 'GET',
                  headers: { "Authorization": "Bearer " + accessToken }
              }
          });
      }
  });

// Reddit Post
Services.factory('RedditPostResource',
  function ($resource) {
      return function (accessToken) {
          return $resource(location.origin + ':8000/reddit/post', {}, {
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
//Services.factory('LinkedInAccessTokenResource', ['$resource',
  //function ($resource) {
      //return $resource('https://lahunaweb.azurewebsites.net/api/linkedin/get-access-token', {}, {
          //Get: {
              //method: 'GET'
          //}
      //});
  //}]);

// LinkedIn Access Token
Services.factory('LinkedInAccessTokenResource',
  function ($resource) {
      return $resource(location.origin + ':8000/linkedin/access_token', {}, {
          Post: {
              method: 'POST'
          }
      });
  });

// LinkedIn Profile
Services.factory('LinkedInProfileResource',
  function ($resource) {
      return function (accessToken) {
          return $resource(location.origin + ':8000/linkedin/profile', {}, {
              Get: {
                  method: 'GET',
                  headers: { "Authorization": "Bearer " + accessToken }
              }
          });
      }
  });

// LinkedIn Post
Services.factory('LinkedInPostResource',
  function ($resource) {
      return function (accessToken) {
          return $resource(location.origin + ':8000/linkedin/post', {}, {
              Post: {
                  method: 'POST',
                  headers: { "Authorization": "Bearer " + accessToken }
              }
          });
      }
  });

// Twitter Request Token
Services.factory('TwitterRequestTokenResource', ['$resource',
  function ($resource) {
      return $resource(location.origin + ':8000/twitter/request_token', {}, {
          Post: {
              method: 'POST'
          }
      });
  }]);

// Twitter Access Token
Services.factory('TwitterAccessTokenResource', ['$resource',
  function ($resource) {
      return $resource(location.origin + ':8000/twitter/access_token', {}, {
          Post: {
              method: 'POST'
          }
      });
  }]);

// Twitter Profile
Services.factory('TwitterProfileResource', ['$resource',
  function ($resource) {
      return $resource(location.origin + ':8000/twitter/profile', {}, {
          Get: {
              method: 'GET'
          }
      });
  }]);

// Twitter Post
Services.factory('TwitterPostResource', ['$resource',
  function ($resource) {
      return $resource(location.origin + ':8000/twitter/post', {}, {
          Post: {
              method: 'POST'
          }
      });
  }]);

// Tumblr Request Token
Services.factory('TumblrRequestTokenResource', ['$resource',
  function ($resource) {
      return $resource(location.origin + ':8000/tumblr/request_token', {}, {
          Post: {
              method: 'POST'
          }
      });
  }]);

// Tumblr Access Token
Services.factory('TumblrAccessTokenResource', ['$resource',
  function ($resource) {
      return $resource(location.origin + ':8000/tumblr/access_token', {}, {
          Post: {
              method: 'POST'
          }
      });
  }]);

// Tumblr Profile
Services.factory('TumblrProfileResource', ['$resource',
  function ($resource) {
      return $resource(location.origin + ':8000/tumblr/profile', {}, {
          Get: {
              method: 'GET'
          }
      });
  }]);

// Tumblr Post
Services.factory('TumblrPostResource', ['$resource',
  function ($resource) {
      return $resource(location.origin + ':8000/tumblr/post', {}, {
          Post: {
              method: 'POST'
          }
      });
  }]);
