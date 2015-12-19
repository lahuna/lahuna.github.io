//*****************************************************************************************************************
// Copyright � 2014 - 2015 Lahuna. All rights reserved.
// You may not copy, reproduce, republish, disassemble, decompile, reverse engineer, post, broadcast, transmit, or
// make available to the public any content or code on this website without prior written permission from Lahuna.
//*****************************************************************************************************************
'use strict';

var ctl = angular.module('Controllers', ['ResourceFactory', 'AuthenticateFactory', 'PlaylistFactory']);

ctl.controller('ViewerCtrl',
  function ($scope, $routeParams, $window, $location, $modal,
    Auth, Playlist, ChannelResource, VideoResource,
    YoutubeSearchResource, SearchResource,
    PlaylistResource, PlaylistDbResource,
    PlaylistItemResource, PlaylistItemDbResource) {

    var player;

    Auth.Authenticate('vida', function (result) {
      $scope.displayName = result;
      if (result) {
        GetChannelId();
      }
      InitializePlayer();
    });

    function GetAccessToken() {
      return localStorage.getItem('youtube_access_token');
    }

    function GetChannelId() {
      ChannelResource.Get({
        part: "id",
        mine: "true",
        accessToken: GetAccessToken()
      }).$promise.then(function (data) {
        localStorage.setItem("youtube_channel_id", data.items[0].id);
        Initialize();
      });
    }

        //****************************************
        // INITIALIZE
        //****************************************

        function Initialize() {
            $scope.editVisible = false;
            $scope.saveVisible = false;
            $scope.successVisible = false;
            //$scope.saveAddToVisible = false;
            //$scope.successAddToVisible = false;
            SetType();
            ClearPlaylist();
            GetItem();
        }

        function InitializePlayer() {
            var tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            var firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

            $window.onYouTubeIframeAPIReady = function () {
                LoadPlayer();
            }
        }

        function LoadPlayer() {
            switch ($routeParams.type) {
                case 'video':
                    LoadVideoPlayer();
                    break;

                case 'videolist':
                    GetVideoList();
                    break;

                case 'playlist':
                    LoadPlaylistPlayer();
                    break;

                case 'playlist-items':
                    GetPlaylistItems();
                    break;
            }
        }

        function LoadVideoPlayer() {
            player = new YT.Player('ytPlayer', {
                videoId: $routeParams.id,
                playerVars: {
                    autoplay: '1',
                    rel: '0'
                }
            });
        }

        function GetVideoList() {
            YoutubeSearchResource.Get({
                part: "id",
                maxResults: "49",
                type: "video",
                relatedToVideoId: $routeParams.id,
                accessToken: GetAccessToken()
            }).$promise.then(function (data) {
                var videoList = [];
                var i = 0;
                var items = data.items;
                for (i = 0; i < items.length; i++) {
                    videoList.push(items[i].id.videoId)
                }
                LoadVideoListPlayer($routeParams.id, videoList.toString());
            })
        }

        function GetPlaylistItems() {
            PlaylistItemResource.Get({
                part: "contentDetails",
                maxResults: "50",
                playlistId: $routeParams.id,
                accessToken: GetAccessToken()
            }).$promise.then(function (data) {
                var videoList = [];
                var items = data.items;
                for (var i = 1; i < items.length; i++) {
                    videoList.push(items[i].contentDetails.videoId)
                }
                LoadVideoListPlayer(items[0].contentDetails.videoId, videoList.toString());
            })
        }

        function LoadVideoListPlayer(videoId, videoList) {
            player = new YT.Player('ytPlayer', {
                videoId: videoId,
                playerVars: {
                    autoplay: '1',
                    rel: '0',
                    playlist: videoList
                }
            });
        }

        function LoadPlaylistPlayer() {
            player = new YT.Player('ytPlayer', {
                playerVars: {
                    autoplay: '1',
                    rel: '0',
                    listType: 'playlist',
                    list: $routeParams.id
                },

                events: {
                    'onStateChange': onPlayerStateChange
                }
            });
        }

        function onPlayerStateChange(event) {
            if (event.data == YT.PlayerState.ENDED) {
                var index = event.target.getPlaylistIndex();
                event.target.playVideoAt(index);
            }
        }

        //var accessToken = GetAccessToken();
        //if (IsVideo()) {
        //    VideoResource(accessToken).Get({
        //        id: $routeParams.id,
        //    }).$promise.then(function (data) {
        //        SetData(data);
        //    });
        //} else {
        //    PlaylistResource(accessToken).Get({
        //        id: $routeParams.id,
        //    }).$promise.then(function (data) {
        //        SetData(data);
        //    });
        //}

        function SetType() {
            if (IsVideo())
                $scope.type = "Video";
            else
                $scope.type = "Playlist";
        }

        function SetData(data) {
            $scope.item = data.items[0];

            if (data.items[0].snippet.channelId == localStorage.getItem("youtube_channel_id"))
                $scope.editVisible = true;
        }

        //$scope.$watch('item.status.embeddable', function (value) {
        //    $scope.embedClass = value ? "glyphicon glyphicon-check" : "glyphicon glyphicon-unchecked";
        //});

        $scope.AddTag = function () {
            AddTag();
        }

        $scope.GoAddTag = function ($event) {
            var keypressed = $event.keyCode || $event.which;
            if (keypressed == 13 || keypressed == 9)
                AddTag();
        }

        function AddTag() {

            if (!$scope.item.snippet.tags)
                $scope.item.snippet.tags = [];

            if ($scope.item.snippet.tags.indexOf($scope.tag) == -1) {
                $scope.item.snippet.tags.push($scope.tag);
                InsertSearch();
                $scope.tag = "";
                UpdateItem(false);
            }
        }

        $scope.RemoveTag = function (item) {
            var index = $scope.item.snippet.tags.indexOf(item);
            $scope.item.snippet.tags.splice(index, 1);
            UpdateItem(false);
        }

        function IsVideo() {
            if ($routeParams.type == 'video')
                return true;
            else
                return false;
        }

        function GetItem() {
          if (IsVideo()) {
            GetVideo();
            GetVideoDetails();
          } else {
            GetPlaylist();
          }
        }

        function GetVideoDetails() {
            VideoResource.Get({
                id: $routeParams.id,
                part: 'snippet,status,contentDetails,topicDetails,' +
                  'recordingDetails,fileDetails,processingDetails,suggestions',
                accessToken: GetAccessToken()
            }).$promise.then(function (data) {
              $scope.raw = data;
            });
        }

        function GetVideo() {
            VideoResource.Get({
                id: $routeParams.id,
                part: 'snippet,status',
                accessToken: GetAccessToken()
            }).$promise.then(function (data) {
                SetData(data);
                GetVideoPlaylists();
            });
        }

        function GetPlaylist() {
            PlaylistResource.Get({
                id: $routeParams.id,
                part: 'snippet,status',
                accessToken: GetAccessToken()
            }).$promise.then(function (data) {
                SetData(data);
                $scope.raw = data;
            });
        }

        function GetVideoPlaylists() {
          $scope.playlists = [];
          PlaylistItemDbResource.Get({
            videoId: $routeParams.id,
            maxdocs: 20,
            accessToken: GetAccessToken()
          }).$promise.then(function (items) {
            if (items.error) {
              return;
            }

            for (var i = 0; i < items.list.length; i++) {
              var item = items.list[i];
              PlaylistDbResource.Get({
                playlistId: item.playlistId,
                accessToken: GetAccessToken(),
                maxdocs: 1
              }).$promise.then(function (result) {
                if (result.list && result.list[0]) {
                  var pl = {
                    "playlistItemId": item.playlistItemId,
                    "title": result.list[0].title
                  }
                  $scope.playlists.push(pl);
                }
              });
            }
          });
        }

        $scope.TitleChanged = function () {
            $scope.successVisible = false;
            if ($scope.item.snippet.title.length > 0)
                $scope.saveVisible = true;
        }

        //$scope.AddToChanged = function () {
        //    $scope.saveAddToVisible = true;
        //    $scope.successAddToVisible = false;
        //}

        $scope.GoSave = function ($event) {
            var keypressed = $event.keyCode || $event.which;
            if ((keypressed == 13 || keypressed == 9) && item.snippet.title.length > 0)
                UpdateItem(false);
            // TODO: add else statement to set title box into edit mode?
        }

        $scope.Save = function (reload) {
            UpdateItem(reload);
        }

        function UpdateItem(reload) {
            if (IsVideo())
                UpdateVideo(reload);
            else
                UpdatePlaylistChange(reload);
        }

        function UpdateVideo(reload) {
            $scope.item.accessToken = GetAccessToken();
            VideoResource.Put($scope.item)
                .$promise.then(function (data) {
                    // TODO: Handle Errors Here

                    if ($scope.saveVisible) {
                        $scope.saveVisible = false;
                        $scope.successVisible = true;
                    }

                    Playlist.UpdateVideo($scope.item.id, function(result) {
                      if (reload) {
                        $window.location.reload();
                      }
                    });
                });
        }

        function UpdatePlaylistChange(reload) {
            $scope.item.accessToken = GetAccessToken();
            PlaylistResource.Put($scope.item)
                .$promise.then(function (data) {
                    // TODO: Handle Errors Here

                    if ($scope.saveVisible) {
                        $scope.saveVisible = false;
                        $scope.successVisible = true;
                    }

                    Playlist.UpdatePlaylist($scope.item.id, function(result) {
                      if (reload) {
                        $window.location.reload();
                      }
                    });
                });
        }

        /*function UpdatePlaylist() {
            var pl = $scope.item;
            PlaylistDbResource.Put({
                playlistId: pl.id,
                title: pl.snippet.title,
                thumbnail: pl.snippet.thumbnails.default.url,
                tags: SetTags(pl),
                publishedDate: pl.snippet.publishedAt,
                privacy: pl.status.privacyStatus,
                accessToken: GetAccessToken()
            })
        }*/

        function SetTags(pl) {
            if (pl.snippet.tags)
                return pl.snippet.tags.toString();
            else
                return "[]";
        }

        function GetError(item) {
            if (item.status.rejectionReason)
                return item.status.rejectionReason;
            else
                return 'na';
        }

        function DeleteItem() {
            if (IsVideo())
                DeleteVideo();
            else
                DeletePlaylist();
        }

        function DeleteVideo() {
            VideoResource.Delete({
                id: $scope.item.id,
                accessToken: GetAccessToken()
            }).$promise.then(function (data) {
                // TODO: Handle Errors Here

                VideoDbResource.Delete({
                  videoId: $scope.item.id,
                  accessToken: GetAccessToken()
                });
                RemoveVideoFromAllPlaylists();
                $window.history.back();
                //if ($routeParams.ref == 'p')
                //    $window.location.href = '/vida/#/my-playlists';
                //else
                //    $window.history.back();
            });
        }

        function RemoveVideoFromAllPlaylists() {
            for (var i = 0; i < $scope.playlists.length; i++) {
                RemovePlaylist(i);
            }
        }

        function DeletePlaylist() {
            PlaylistResource.Delete({
                id: $scope.item.id,
                accessToken: GetAccessToken()
            }).$promise.then(function (data) {
                // TODO: Handle Errors Here

                PlaylistDbResource.Delete({
                    playlistId: $scope.item.id,
                    accessToken: GetAccessToken()
                }).$promise.then(function () {
                    $window.history.back();
                })
            })
        }

        function GetType() {
            if (IsVideo())
                return "video";
            else
                return "playlist";
        }

        function InsertSearch() {
            var query = $scope.tag;
            if (query && query.length > 0)
                SearchResource.Post({
                    query: query,
                    type: GetType(),
                    accessToken: GetAccessToken()
                });
        }

        $scope.GetSearchList = function (val) {
            return SearchResource.Get({
                query: val,
                type: GetType(),
                userId: localStorage.getItem('youtube_user_id'),
                maxdocs: 10
            }).$promise.then(function (data) {
                return data.list;
            });
        }

        $scope.SelectPrivacy = function (value) {
            $scope.item.status.privacyStatus = value;
            UpdateItem(true);
        }

        $scope.$watch('item.status.privacyStatus', function (value) {
            switch (value) {
                case 'private':
                    $scope.privacyText = 'Private';
                    break;

                case 'unlisted':
                    $scope.privacyText = 'Unlisted';
                    break;

                case 'public':
                    $scope.privacyText = 'Public';
                    break;
            }
        });

        $scope.privacyInfo = "Set privacy to Unlisted or Public so you can watch your videos on Lahuna.";
        //"<a href=\'https://support.google.com/youtube/answer/157177\' target=\'blank\'>Learn More</a>";
        //$scope.embedInfo = "Allow embedding so you can watch your videos on Lahuna."

        $scope.open = function () {
            var modalInstance = $modal.open({
                templateUrl: 'views/modal.html',
                controller: 'ModalInstanceCtrl',
                animation: true,
                backdrop: true,
                size: 'sm'
            });

            modalInstance.result.then(function (result) {
                if (result == 'ok')
                    DeleteItem();
            })
        }

        //****************************************
        // ADD TO PLAYLIST
        //****************************************

        function ClearPlaylist() {
            $scope.playlist = {
                playlistItemId: '',
                title: ''
            }
        }

        $scope.GetPlaylistHints = function (val) {
            return SearchResource.Get({
                query: val,
                type: 'playlist',
                userId: localStorage.getItem('youtube_user_id'),
                maxdocs: 10
            }).$promise.then(function (data) {
                return data.list;
            });
        }

        $scope.AddPlaylist = function () {
            AddPlaylist();
        }

        $scope.GoAddPlaylist = function ($event) {
            var keypressed = $event.keyCode || $event.which;
            if (keypressed == 13 || keypressed == 9)
                AddPlaylist();
        }

        function AddPlaylist() {
          var video = $scope.item;
          var title = $scope.playlist.title;
          Playlist.AddToPlaylist(video, title, function (playlistId, playlistItemId) {
            $scope.playlist.playlistItemId = playlistItemId;
            MovePlaylist();
          });
        }

        function MovePlaylist() {
            if (!$scope.playlists)
                $scope.playlists = [];

            $scope.playlists.push($scope.playlist);
            ClearPlaylist();

            //if ($scope.playlists.list.indexOf($scope.playlist) == -1) {
            //    $scope.playlists.list.push($scope.playlist);
            //    ClearPlaylist();
            //}
        }

        $scope.RemovePlaylist = function (index) {
            RemovePlaylist(index);
        }

        function RemovePlaylist(index) {
            var pl = $scope.playlists[index];
            $scope.playlists.splice(index, 1);
            DeletePlaylistItem(pl);
        }

        function DeletePlaylistItem(pl) {
            PlaylistItemResource.Delete({
                id: pl.playlistItemId,
                accessToken: GetAccessToken()
            }).$promise.then(function (data) {
              PlaylistItemDbResource.Delete({
                  playlistItemId: pl.playlistItemId,
                  accessToken: GetAccessToken()
              });
              UpdatePlaylist(pl.playlistId);
            });
        }

 });

ctl.controller('ModalInstanceCtrl', function ($scope, $modalInstance) {

    $scope.ok = function () {
        $modalInstance.close('ok');
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});

//Controllers.controller('MainCtrl',
//    function ($scope, $routeParams, GoogleProfileResource, GoogleRefreshTokenResource, ChannelResource) {

//        var access_token = localStorage.getItem("youtube_access_token");
//        GoogleProfileResource(access_token).Get()
//            .$promise.then(function (data) {
//                $scope.google_profile = data;
//                localStorage.setItem("youtube_user_id", data.id);
//                GetChannelId();
//            }, function (error) {
//                GetGoogleRefreshToken();
//            })

//        function GetGoogleRefreshToken() {
//            GoogleRefreshTokenResource.Get({
//                refresh_token: localStorage.getItem("youtube_refresh_token")
//            })
//                .$promise.then(function (data) {
//                    localStorage.setItem("youtube_access_token", data.access_token);
//                    localStorage.setItem("youtube_expires_in", data.expires_in);
//                    GoogleProfileResource(data.access_token).Get()
//                        .$promise.then(function (data) {
//                            $scope.google_profile = data;
//                            localStorage.setItem("youtube_user_id", data.id);
//                            GetChannelId();
//                        })
//                })
//        }

//        function GetChannelId() {
//            var access_token = localStorage.getItem("youtube_access_token");
//            ChannelResource(access_token).Get({
//                part: "id",
//                mine: "true"
//            }).$promise.then(function (data) {
//                localStorage.setItem("youtube_channel_id", data.items[0].id);
//            });
//        }
//    });
