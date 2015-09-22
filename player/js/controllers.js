//*****************************************************************************************************************
// Copyright © 2014 - 2015 Lahuna. All rights reserved.
// You may not copy, reproduce, republish, disassemble, decompile, reverse engineer, post, broadcast, transmit, or
// make available to the public any content or code on this website without prior written permission from Lahuna.
//*****************************************************************************************************************
'use strict';

/* Controllers */

var Controllers = angular.module('Controllers', []);

Controllers.controller('ViewerCtrl',
    function ($scope, $routeParams, $window, $location, $modal,
        VideoResource, PlaylistResource, SearchResource,
        InsertSearchResource, GetSearchResource, UpdatePlaylistResource, DeletePlaylistResource,
        GetPlaylistHintsResource, PlaylistItemResource,
        InsertPlaylistResource, GetPlaylistIdResource,
        GetPlaylistItemResource, InsertPlaylistItemResource, DeletePlaylistItemResource,
        AuthenticateResource, ChannelResource) {

        //****************************************
        // AUTHENTICATE
        //****************************************

        $scope.needSignIn = false;
        Authenticate();

        function Authenticate() {
            AuthenticateResource.Get({
                accessToken: GetAccessToken(),
                refreshToken: GetRefreshToken()
            }).$promise.then(function (data) {
                StoreValues(data.authItem);
            }, function (error) {
                $scope.needSignIn = true;
            });
        }

        function StoreValues(data) {
            localStorage.setItem("youtube_access_token", data.AccessToken);
            localStorage.setItem("youtube_user_id", data.UserId);
            localStorage.setItem("youtube_expires_in", data.ExpiresIn);
            GetChannelId();
        }

        function GetAccessToken() {
            return localStorage.getItem("youtube_access_token");
        }

        function GetRefreshToken() {
            return localStorage.getItem("youtube_refresh_token");
        }

        function GetChannelId() {
            var access_token = localStorage.getItem("youtube_access_token");
            ChannelResource(access_token).Get({
                part: "id",
                mine: "true"
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

            var tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            var firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        }        

        $window.onYouTubeIframeAPIReady = function () {
            LoadPlayer();
        }

        var player;

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

            var access_token = localStorage.getItem("youtube_access_token");
            SearchResource(access_token).Get({
                part: "id",
                maxResults: "49",
                type: "video",
                relatedToVideoId: $routeParams.id
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

            var access_token = localStorage.getItem("youtube_access_token");
            PlaylistItemResource(access_token).Get({
                part: "contentDetails",
                maxResults: "50",
                playlistId: $routeParams.id
            }).$promise.then(function (data) {
                var videoList = [];
                var i = 1;
                var items = data.items;
                for (i = 1; i < items.length; i++) {
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

            if ($scope.item.snippet.tags == undefined)
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
            if (IsVideo())
                GetVideo();
            else
                GetPlaylist();
        }

        function GetVideo() {
            VideoResource(GetAccessToken()).Get({
                id: $routeParams.id,
            }).$promise.then(function (data) {
                SetData(data);
                GetVideoPlaylists();
            });
        }

        function GetPlaylist() {
            PlaylistResource(GetAccessToken()).Get({
                id: $routeParams.id,
            }).$promise.then(function (data) {
                SetData(data);
            });
        }

        function GetVideoPlaylists() {
            $scope.playlists = GetPlaylistItemResource.Get({
                videoId: $routeParams.id,
                accessToken: GetAccessToken()
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
            VideoResource(GetAccessToken()).Update($scope.item)
                .$promise.then(function (data) {
                    // TODO: Handle Errors Here

                    if ($scope.saveVisible) {
                        $scope.saveVisible = false;
                        $scope.successVisible = true;
                    }

                    if (reload)
                        $window.location.reload();
                });
        }

        function UpdatePlaylistChange(reload) {
            PlaylistResource(GetAccessToken()).Update($scope.item)
                .$promise.then(function (data) {
                    // TODO: Handle Errors Here

                    if ($scope.saveVisible) {
                        $scope.saveVisible = false;
                        $scope.successVisible = true;
                    }

                    if (reload)
                        $window.location.reload();
                    else
                        UpdatePlaylistDB();
                });
        }

        function UpdatePlaylistDB() {
            var pl = $scope.item;
            UpdatePlaylistResource.Update({
                playlistId: pl.id,
                title: pl.snippet.title,
                thumbnail: pl.snippet.thumbnails.default.url,
                tags: SetTags(pl),
                publishedDate: pl.snippet.publishedAt,
                privacy: pl.status.privacyStatus,
                accessToken: GetAccessToken()
            })
        }

        function SetTags(pl) {
            if (pl.snippet.tags != undefined)
                return pl.snippet.tags.toString();
            else
                return "[]";
        }

        function GetError(item) {
            if (item.status.rejectionReason != undefined)
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
            VideoResource(GetAccessToken()).Delete({
                id: $scope.item.id
            }).$promise.then(function (data) {
                // TODO: Handle Errors Here

                RemoveVideoFromAllPlaylists();
                $window.history.back();
                //if ($routeParams.ref == 'p')
                //    $window.location.href = '/vida/#/my-playlists';
                //else
                //    $window.history.back();
            });
        }

        function RemoveVideoFromAllPlaylists() {
            var i = 0;
            for (i = 0; i < $scope.playlists.list.length; i++) {
                RemovePlaylist(i);
            }
        }

        function DeletePlaylist() {
            PlaylistResource(GetAccessToken()).Delete({
                id: $scope.item.id
            }).$promise.then(function (data) {
                // TODO: Handle Errors Here

                DeletePlaylistResource.Delete({
                    id: $scope.item.id,
                    accessToken: GetAccessToken()
                }).$promise.then(function () {
                    $window.history.back();
                })
            })
        }

        function GetType() {
            if (IsVideo())
                return "youtube";
            else
                return "youtube-playlist";
        }

        function InsertSearch() {
            var query = $scope.tag;
            if (query != undefined && query != "")
                InsertSearchResource.Insert({
                    userId: localStorage.getItem("youtube_user_id"),
                    query: query,
                    type: GetType()
                });
        }

        $scope.GetSearchList = function (val) {
            return GetSearchResource.Get({
                userId: localStorage.getItem("youtube_user_id"),
                query: val,
                type: GetType()
            }).$promise.then(function (data) {
                return data;
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
                playlistId: '',
                title: ''
            }
        }

        $scope.GetPlaylistHints = function (val) {
            return GetPlaylistHintsResource.Get({
                userId: localStorage.getItem("youtube_user_id"), // TODO: pass access token instead?
                query: val
            }).$promise.then(function (data) {
                return data;
            });
        }

        $scope.AddPlaylist = function () {
            GetPlaylistId();
        }

        $scope.GoAddPlaylist = function ($event) {
            var keypressed = $event.keyCode || $event.which;
            if (keypressed == 13 || keypressed == 9)
                GetPlaylistId();
        }

        function GetPlaylistId() {
            GetPlaylistIdResource.Get({
                title: $scope.playlist.title,
                accessToken: GetAccessToken()
            }).$promise.then(function (data) {
                if (data.id != null) {
                    $scope.playlist.playlistId = data.id;
                    GetPlaylistItem(data.id);
                } else
                    CreatePlaylist();
            })
        }

        function CreatePlaylist() {
            PlaylistResource(GetAccessToken()).Create({
                snippet: {
                    title: $scope.playlist.title,
                    tags: [$scope.playlist.title]
                },
                status: {
                    privacyStatus: "unlisted"
                }
            }).$promise.then(function (data) {
                $scope.playlist.playlistId = data.id;
                InsertPlaylist(data);
            })
        }

        function InsertPlaylist(data) {
            InsertPlaylistResource.Insert({
                userId: localStorage.getItem("youtube_user_id"),
                playlistId: data.id,
                title: data.snippet.title,
                thumbnail: data.snippet.thumbnails.default.url,
                tags: data.snippet.tags.toString(),
                publishedDate: data.snippet.publishedAt,
                privacy: data.status.privacyStatus
            }).$promise.then(function () {
                AddToPlaylist(data.id);
            });
        }

        function UpdatePlaylist(playlistId) {
            PlaylistResource(GetAccessToken()).Get({
                id: playlistId
            }).$promise.then(function (data) {
                var pl = data.items[0];
                UpdatePlaylistResource.Update({
                    playlistId: pl.id,
                    title: pl.snippet.title,
                    thumbnail: pl.snippet.thumbnails.default.url,
                    tags: SetTags(pl),
                    publishedDate: pl.snippet.publishedAt,
                    privacy: pl.status.privacyStatus,
                    accessToken: GetAccessToken()
                })
            });
        }

        function GetPlaylistItem(playlistId) {
            PlaylistItemResource(GetAccessToken()).Get({
                part: 'snippet',
                playlistId: playlistId,
                videoId: $scope.item.id,
                maxResults: 50
            }).$promise.then(function (data) {
                if (data.items.length == 0)
                    AddToPlaylist(playlistId);
            });
        }

        function AddToPlaylist(playlistId) {
            PlaylistItemResource(GetAccessToken()).Add({
                snippet: {
                    playlistId: playlistId,
                    resourceId: {
                        kind: "youtube#video",
                        videoId: $scope.item.id
                    }
                }
            }).$promise.then(function (data) {
                //$scope.saveAddToVisible = false;
                //$scope.successAddToVisible = true;
                //$scope.playlist = "";
                $scope.playlist.playlistItemId = data.id;
                MovePlaylist();
                InsertPlaylistItem(data);
                UpdatePlaylist(playlistId);
            });
        }

        function InsertPlaylistItem(data) {
            InsertPlaylistItemResource.Insert({
                userId: localStorage.getItem("youtube_user_id"),
                playlistItemId: data.id,
                playlistId: data.snippet.playlistId,
                videoId: $scope.item.id
            });
        }

        function MovePlaylist() {

            if ($scope.playlists.list == undefined)
                $scope.playlists.list = [];

            $scope.playlists.list.push($scope.playlist);
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
            var pl = $scope.playlists.list[index];
            $scope.playlists.list.splice(index, 1);
            RemovePlaylistItem(pl);
            DeletePlaylistItem(pl);
        }

        function RemovePlaylistItem(pl) {
            PlaylistItemResource(GetAccessToken()).Remove({
                id: pl.playlistItemId
            }).$promise.then(function (data) {
                UpdatePlaylist(pl.playlistId);
            });
        }

        function DeletePlaylistItem(pl) {
            DeletePlaylistItemResource.Delete({
                playlistItemId: pl.playlistItemId,
                accessToken: GetAccessToken()
            });
        }
 });

Controllers.controller('ModalInstanceCtrl', function ($scope, $modalInstance) {

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