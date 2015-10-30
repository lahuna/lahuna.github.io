//*****************************************************************************************************************
// Copyright � 2014 - 2015 Lahuna. All rights reserved.
// You may not copy, reproduce, republish, disassemble, decompile, reverse engineer, post, broadcast, transmit, or
// make available to the public any content or code on this website without prior written permission from Lahuna.
//*****************************************************************************************************************

'use strict';

/* Controllers */

var Controllers = angular.module('Controllers', []);

Controllers.controller('MainCtrl',
  function ($scope, $routeParams,
      GoogleProfileResource, GoogleRefreshTokenResource,
      BloggerGetResource, BloggerPostResource, BloggerGetPostsResource,
      FacebookProfileResource, FacebookPostResource,
       LinkedInProfileResource, LinkedInPostResource,
      ImgurProfileResource, ImgurPostResource, ImgurRefreshTokenResource,
      RedditProfileResource, RedditPostResource, RedditRefreshTokenResource,
      TwitterRequestTokenResource, TwitterProfileResource, TwitterPostResource,
      TumblrRequestTokenResource, TumblrProfileResource, TumblrPostResource) {

      $scope.origin = location.origin;

      GetGoogleProfile();
      GetFacebookProfile();
      GetImgurProfile();
      GetRedditProfile();
      GetTwitterProfile();
      GetTumblrProfile();
      GetLinkedInProfile();


      $scope.Post = function () {
          //PostFacebook();
          //PostTwitter();
          //PostTumblr();
          //PostLinkedIn();
          //PostReddit();
          //PostImgur();
          //PostBlogger();
          //GetBloggerPosts();
      };

      $scope.LoginToTwitter = function () {
          TwitterRequestTokenResource.Post({
            redirectUri: location.origin + "/blitz/twitter"
          })
          .$promise.then(function (data) {
              localStorage.setItem("twitter_oauth_token", data.oauth_token);
              localStorage.setItem("twitter_oauth_token_secret", data.oauth_token_secret);
              location.href = "https://api.twitter.com/oauth/authenticate?oauth_token=" + data.oauth_token;
          });
      };

      $scope.LoginToTumblr = function () {
          TumblrRequestTokenResource.Post({
            redirectUri: location.origin + "/blitz/tumblr"
          })
          .$promise.then(function (data) {
              localStorage.setItem("tumblr_oauth_token", data.oauth_token);
              localStorage.setItem("tumblr_oauth_token_secret", data.oauth_token_secret);
              location.href = "https://www.tumblr.com/oauth/authorize?oauth_token=" + data.oauth_token;
          });
      };

      //function GetGoogleProfile() {
      //    $scope.google_profile = GoogleProfileResource.Get();
      //}

      function GetGoogleProfile() {
          var accessToken = localStorage.getItem("blogger_access_token");
          GoogleProfileResource(accessToken).Get()
          .$promise.then(function (data) {
              $scope.google_profile = data;
              GetBlogger();
          }, function (error) {
              GetGoogleRefreshToken();
          });
      }

      function GetGoogleRefreshToken() {
          GoogleRefreshTokenResource.Get({
              refresh_token: localStorage.getItem("blogger_refresh_token")
          })
          .$promise.then(function (data) {
              localStorage.setItem("blogger_access_token", data.access_token);
              localStorage.setItem("blogger_expires_in", data.expires_in);
              $scope.google_profile = GoogleProfileResource(data.access_token).Get();
              GetBlogger();
          });
      }

      function GetFacebookProfile() {
          $scope.facebook_profile = FacebookProfileResource.Get({
              access_token: localStorage.getItem("facebook_access_token")
          });
      }

      function PostFacebook() {

          var message = "";
          var link = "";

          switch ($scope.type) {

              case "text":
              case "quote":
                  message = $scope.body;

              case "link":
              case "photo":
              case "video":
              case "audio":
                  link = $scope.body;
                  message = $scope.title;
          }

          FacebookPostResource.Post({
              message: message,
              link: link,
              access_token: localStorage.getItem("facebook_access_token"),
          });
      }

      function GetTwitterProfile() {
          $scope.twitter_profile = TwitterProfileResource.Get({
              oauth_token: localStorage.getItem("twitter_access_token"),
              oauth_token_secret: localStorage.getItem("twitter_access_token_secret"),
              user_id: localStorage.getItem("twitter_user_id")
          });
      }

      function PostTwitter() {
          TwitterPostResource.Post({
              oauth_token: localStorage.getItem("twitter_access_token"),
              oauth_token_secret: localStorage.getItem("twitter_access_token_secret"),
              status: $scope.body
          });
      }

      function GetLinkedInProfile() {
          var accessToken = localStorage.getItem("linkedin_access_token");
          $scope.linkedin_profile = LinkedInProfileResource(accessToken).Get();
      }

      function PostLinkedIn() {
          var accessToken = localStorage.getItem("linkedin_access_token");
          LinkedInPostResource(accessToken).Post({
              comment: $scope.title + ": " + $scope.body,
              visibility: {
                  code: "anyone"
              }
          });
      }

      function GetImgurProfile() {
          var accessToken = localStorage.getItem("imgur_access_token");
          var userName = localStorage.getItem("imgur_account_username");
          ImgurProfileResource(accessToken, userName).Get()
          .$promise.then(function (data) {
              $scope.imgur_username = data.data.url;
          }, function (error) {
              GetImgurRefreshToken();
          });
      }

      function GetImgurRefreshToken() {
          ImgurRefreshTokenResource.Get({
              refresh_token: localStorage.getItem("imgur_refresh_token")
          })
          .$promise.then(function (data) {
              localStorage.setItem("imgur_access_token", data.access_token);
              localStorage.setItem("imgur_expires_in", data.expires_in);
              localStorage.setItem("imgur_refresh_token", data.refresh_token);
              localStorage.setItem("imgur_account_username", data.account_username);
              localStorage.setItem("imgur_account_id", data.account_id);
              $scope.imgur_username = data.account_username;
          });
      }

      function PostImgur() {
          var accessToken = localStorage.getItem("imgur_access_token");
          ImgurPostResource(accessToken).Post({
              image: $scope.body,
              title: $scope.title
          });
      }

      function GetRedditProfile() {
          var accessToken = localStorage.getItem("reddit_access_token");
          RedditProfileResource(accessToken).Get()
          .$promise.then(function (data) {
              if (data.name == undefined)
                  GetRedditRefreshToken();
              else
                 $scope.reddit_profile = data;
          }, function (error) {
              GetRedditRefreshToken();
          });
      }

      function GetRedditRefreshToken() {
          RedditRefreshTokenResource.Get({
              refresh_token: localStorage.getItem("reddit_refresh_token")
          })
          .$promise.then(function (data) {
              var accessToken = data.access_token;
              localStorage.setItem("reddit_access_token", accessToken);
              localStorage.setItem("reddit_expires_in", data.expires_in);
              $scope.reddit_profile = RedditProfileResource(accessToken).Get();
          });
      }

      function PostReddit() {
          var accessToken = localStorage.getItem("reddit_access_token");
          RedditPostResource(accessToken).Post({
              category: 'programming',
              type: $scope.type,
              title: $scope.title,
              body: $scope.body
          });
      }

      function GetBloggerPosts() {
          var accessToken = localStorage.getItem("blogger_access_token");
          BloggerGetPostsResource(accessToken).Get({
              blogId: $scope.blogger.items[0].id
          });
      }

      function GetBlogger() {
          var accessToken = localStorage.getItem("blogger_access_token");
          $scope.blogger = BloggerGetResource(accessToken).Get();
      }

      function PostBlogger() {
          var accessToken = localStorage.getItem("blogger_access_token");
          BloggerPostResource(accessToken).Post({
              kind: "blogger#post",
              blog: { id: $scope.blogger.items[0].id },
              title: $scope.title,
              content: $scope.body,
              blogId: $scope.blogger.items[0].id
          });
      }

      function GetTumblrProfile() {
          $scope.tumblr_profile = TumblrProfileResource.Get({
              oauth_token: localStorage.getItem("tumblr_access_token"),
              oauth_token_secret: localStorage.getItem("tumblr_access_token_secret"),
          });
      }

      function PostTumblr() {
          TumblrPostResource.Post({
              oauth_token: localStorage.getItem("tumblr_access_token"),
              oauth_token_secret: localStorage.getItem("tumblr_access_token_secret"),
              blogUrl: $scope.tumblr_profile.response.user.blogs[0].url.replace('http://', '').replace('/', ''),
              type: $scope.type,
              title: $scope.title,
              body: $scope.body
          });
      }
  });

Controllers.controller('FacebookCtrl', ['$scope', '$routeParams', '$location',
    function ($scope, $routeParams, $location) {

        localStorage.setItem("facebook_access_token", $routeParams.access_token);
        localStorage.setItem("facebook_expires_in", $routeParams.expires_in);
        if ($routeParams.state == "media")
            $location.path('/facebook');
        else
            $location.path('/');

    }]);

Controllers.controller('FacebookMediaCtrl', ['$scope', '$routeParams', '$location',
    'FacebookProfileResource', 'FacebookPostsResource',
    'FacebookAlbumsResource', 'FacebookPhotosResource', 'FacebookVideosResource',
    'FacebookAccountsResource',
    function ($scope, $routeParams, $location,
        FacebookProfileResource, FacebookPostsResource,
        FacebookAlbumsResource, FacebookPhotosResource, FacebookVideosResource,
        FacebookAccountsResource) {

        $scope.facebook_profile = FacebookProfileResource.Get({
            access_token: localStorage.getItem("facebook_access_token")
        });

        $scope.GetPosts = function () {
            $scope.items = FacebookPostsResource.Get({
                access_token: localStorage.getItem("facebook_access_token")
            });
        };

        $scope.GetAlbums = function () {
            $scope.items = FacebookAlbumsResource.Get({
                access_token: localStorage.getItem("facebook_access_token")
            });
        };

        $scope.GetPhotos = function () {
            $scope.items = FacebookPhotosResource.Get({
                access_token: localStorage.getItem("facebook_access_token")
            });
        };

        $scope.GetVideos = function () {
            $scope.items = FacebookVideosResource.Get({
                access_token: localStorage.getItem("facebook_access_token")
            });
        };

        $scope.GetAccounts = function () {
            $scope.items = FacebookAccountsResource.Get({
                access_token: localStorage.getItem("facebook_access_token")
            });
        };

    }]);

Controllers.controller('ImgurCtrl', ['$scope', '$routeParams', '$location',
    function ($scope, $routeParams, $location) {

        localStorage.setItem("imgur_access_token", $routeParams.access_token);
        localStorage.setItem("imgur_expires_in", $routeParams.expires_in);
        localStorage.setItem("imgur_refresh_token", $routeParams.refresh_token);
        localStorage.setItem("imgur_account_username", $routeParams.account_username);
        localStorage.setItem("imgur_account_id", $routeParams.account_id);
        $location.path('/');

    }]);

Controllers.controller('RedditCtrl', ['$scope', '$routeParams', '$location', 'RedditAccessTokenResource',
    function ($scope, $routeParams, $location, RedditAccessTokenResource) {

        if ($routeParams.state == "reddit") {
            localStorage.setItem("reddit_code", $routeParams.code);
            RedditAccessTokenResource.Get({ code: $routeParams.code, redirectUri: location.origin + "/blitz/reddit" })
            .$promise.then(function (data) {
                localStorage.setItem("reddit_access_token", data.access_token);
                localStorage.setItem("reddit_expires_in", data.expires_in);
                localStorage.setItem("reddit_refresh_token", data.refresh_token);
                $location.path('/');
            });
        }
        else
            console.log("Invalid reddit state");

    }]);

Controllers.controller('LinkedInCtrl',
    function ($scope, $routeParams, $location, LinkedInAccessTokenResource) {

        if ($routeParams.state == "linkedin") {
            localStorage.setItem("linkedin_code", $routeParams.code);
            LinkedInAccessTokenResource.Get({ code: $routeParams.code, redirectUri: location.origin + "/blitz/linkedin" })
            .$promise.then(function (data) {
                localStorage.setItem("linkedin_access_token", data.access_token);
                localStorage.setItem("linkedin_expires_in", data.expires_in);
                $location.path('/');
            });
        }
        else
            console.log("Invalid linkedin state");

    });

Controllers.controller('TwitterCtrl', ['$scope', '$routeParams', '$location', 'TwitterAccessTokenResource',
    function ($scope, $routeParams, $location, TwitterAccessTokenResource) {

        localStorage.setItem("twitter_oauth_verifier", $routeParams.oauth_verifier);
        if ($routeParams.oauth_token == localStorage.getItem("twitter_oauth_token")) {
            TwitterAccessTokenResource.Post({
                oauth_token: $routeParams.oauth_token,
                oauth_token_secret: localStorage.getItem("twitter_oauth_token_secret"),
                oauth_verifier: $routeParams.oauth_verifier
            })
            .$promise.then(function (data) {
                localStorage.setItem("twitter_access_token", data.oauth_token);
                localStorage.setItem("twitter_access_token_secret", data.oauth_token_secret);
                localStorage.setItem("twitter_user_id", data.user_id);
                localStorage.setItem("twitter_screen_name", data.screen_name);
                $location.path('/');
            });
        }
        else
            console.log("Twitter oauth tokens do not match");

    }]);

Controllers.controller('TumblrCtrl', ['$scope', '$routeParams', '$location', 'TumblrAccessTokenResource',
    function ($scope, $routeParams, $location, TumblrAccessTokenResource) {

        localStorage.setItem("tumblr_oauth_verifier", $routeParams.oauth_verifier);
        if ($routeParams.oauth_token == localStorage.getItem("tumblr_oauth_token")) {
            TumblrAccessTokenResource.Post({
                oauth_token: $routeParams.oauth_token,
                oauth_token_secret: localStorage.getItem("tumblr_oauth_token_secret"),
                oauth_verifier: $routeParams.oauth_verifier
            })
            .$promise.then(function (data) {
                localStorage.setItem("tumblr_access_token", data.oauth_token);
                localStorage.setItem("tumblr_access_token_secret", data.oauth_token_secret);
                $location.path('/');
            });
        }
        else
            console.log("Tumblr oauth tokens do not match");

    }]);
