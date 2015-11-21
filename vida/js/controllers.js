//*****************************************************************************************************************
// Copyright � 2014 - 2015 Lahuna. All rights reserved.
// You may not copy, reproduce, republish, disassemble, decompile, reverse engineer, post, broadcast, transmit, or
// make available to the public any content or code on this website without prior written permission from Lahuna.
//*****************************************************************************************************************

'use strict';

/* Controllers */

var Controllers = angular.module('Controllers', []);

Controllers.controller('MainCtrl',
    function ($scope, $routeParams, $route, ProfileResource, AuthenticateResource,
        ImportPlaylistResource, ImportPlaylistItemResource) {

        //****************************************
        // AUTHENTICATE
        //****************************************

        $scope.origin = location.origin;
        $scope.needSignIn = false;
        Authenticate();

        function Authenticate() {
          AuthenticateResource.Get({
            accessToken: GetAccessToken(),
            refreshToken: GetRefreshToken()
          })
            .$promise.then(function (data) {
                StoreValues(data);
            }, function (error) {
                $scope.needSignIn = true;
            });
        }

        function StoreValues(data) {
            localStorage.setItem('youtube_access_token', data.access_token);
            localStorage.setItem('youtube_user_id', data.user_id);
            localStorage.setItem('youtube_expires_in', data.expires_in);
            Initialize();
        }

        function GetAccessToken() {
            return localStorage.getItem('youtube_access_token');
        }

        function GetRefreshToken() {
            return localStorage.getItem('youtube_refresh_token');
        }

        //****************************************
        // INITIALIZE
        //****************************************

        function Initialize() {
            GetProfile();

            if ($route.current.originalPath == '/initial')
                Import();
        }

        function GetProfile() {
            ProfileResource(GetAccessToken()).Get()
                .$promise.then(function (data) {
                    $scope.profile = data;
                });
        }

        function Import() {

            ImportPlaylistResource.Post({
                job: 'true',
                accessToken: GetAccessToken()
            }).$promise.then(function () {
                ImportPlaylistItemResource.Post({
                  accessToken: GetAccessToken()
                });
            });
        }





        //$scope.needSignIn = false;
        //VerifyAccessToken(true);

        //function VerifyAccessToken(refresh) {
        //    VerifyTokenResource.Get({
        //        access_token: GetAccessToken()
        //    }).$promise.then(function (data) {
        //        SetUserId(data);
        //    }, function (error) {
        //        if (refresh)
        //            RefreshToken();
        //        else
        //            $scope.needSignIn = true;
        //    });
        //}

        //function RefreshToken() {
        //    RefreshTokenResource.Get({
        //        refresh_token: GetRefreshToken()
        //    }).$promise.then(function (data) {
        //        SetAccessToken(data);
        //    }, function (error) {
        //        $scope.needSignIn = true;
        //    });
        //}

        //function SetUserId(data) {
        //    localStorage.setItem('youtube_user_id', data.user_id);
        //    localStorage.setItem('youtube_expires_in', data.expires_in);
        //    GetProfile();
        //}

        //function SetAccessToken(data) {
        //    localStorage.setItem('youtube_access_token', data.access_token);
        //    VerifyAccessToken(false);
        //}

        //function GetAccessToken() {
        //    return localStorage.getItem('youtube_access_token');
        //}

        //function GetRefreshToken() {
        //    return localStorage.getItem('youtube_refresh_token');
        //}
    });

Controllers.controller('SearchCtrl',
    function ($scope, $routeParams, $location, SearchResource, AutoCompleteResource,
        PlaylistItemDbResource, PlaylistDbResource, YoutubeSearchResource,
        PlaylistItemResource, PlaylistResource, AuthenticateResource) {

        //****************************************
        // AUTHENTICATE
        //****************************************

        $scope.needSignIn = false;
        Authenticate();

        function Authenticate() {
          AuthenticateResource.Get({
            accessToken: GetAccessToken(),
            refreshToken: GetRefreshToken()
          })
          .$promise.then(function (data) {
              StoreValues(data);
          }, function (error) {
              $scope.needSignIn = true;
          });
        }

        function StoreValues(data) {
            localStorage.setItem('youtube_access_token', data.access_token);
            localStorage.setItem('youtube_user_id', data.user_id);
            localStorage.setItem('youtube_expires_in', data.expires_in);
            Initialize();
        }

        function GetAccessToken() {
            return localStorage.getItem('youtube_access_token');
        }

        function GetRefreshToken() {
            return localStorage.getItem('youtube_refresh_token');
        }

        //****************************************
        // INITIALIZE
        //****************************************

        function Initialize() {
            $scope.owner = 'yt';
            $scope.orderVisible = true;

            if (localStorage.getItem('youtube_search') == undefined)
                $scope.search = '';
            else
                $scope.search = localStorage.getItem('youtube_search');

            if (localStorage.getItem('youtube_order') == undefined)
                $scope.order = 'viewCount';
            else
                $scope.order = localStorage.getItem('youtube_order');

            Search();
        }

        //****************************************
        // SEARCH
        //****************************************

        $scope.GoSearch = function ($event) {
            var keypressed = $event.keyCode || $event.which;
            if (keypressed == 13)
                Search();
        }

        $scope.Search = function () {
            Search();
        }

        function Search() {
            localStorage.setItem('youtube_search', $scope.search);
            localStorage.setItem('youtube_order', $scope.order);

            var access_token = localStorage.getItem('youtube_access_token');
            $scope.list = YoutubeSearchResource(access_token).Get({
                q: GetSearch(),
                part: 'snippet',
                order: GetOrder(),
                maxResults: '50',
                type: GetType()
            });
        }

        function GetSearch() {
            if ($scope.search == '')
                return undefined;
            else
                return $scope.search;
        }

        function GetOrder() {
            if ($scope.order == '')
                return undefined;
            else
                return $scope.order;
        }

        function GetType() {
            var path = $location.path();
            if (path.indexOf('video') != -1 || path.indexOf('recommend') != -1)
                return 'video';
            else if (path.indexOf('playlist') != -1)
                return 'playlist';
            else if (path.indexOf('channel') != -1)
                return 'channel';
            else
                return undefined;
        }

        $scope.SelectOrder = function (value) {
            $scope.order = value;
            Search();
        }

        $scope.$watch('order', function (value) {
            switch (value) {
                case 'relevance':
                    $scope.orderText = 'Relevance';
                    break;

                case 'viewCount':
                    $scope.orderText = 'View Count';
                    break;

                case 'rating':
                    $scope.orderText = 'Rating';
                    break;

                case 'date':
                    $scope.orderText = 'Date';
                    break;

                case 'title':
                    $scope.orderText = 'Title';
                    break;
            }
        });

        //****************************************
        // SEARCH HINTS
        //****************************************

        $scope.GetSearchList = function (val) {
            return AutoCompleteResource.Get({
                hl: 'en',
                ds: 'yt',
                client: 'youtube',
                hjson: 't',
                cp: '1',
                q: val,
                format: '5',
                alt: 'json',
                callback: 'JSON_CALLBACK'
            }).$promise.then(function (data) {
                var list = [];
                data = data[1];
                var i;
                for (var i in data) {
                    var item = data[i][0];
                    if (item != undefined)
                        list.push(item);
                }

                return list;
            });
        };

        //****************************************
        // ADD TO PLAYLIST
        //****************************************

        $scope.playlistId = '';

        $scope.GetPlaylistHints = function (val) {
            return SearchResource.Get({
                query: val,
                type: 'playlist',
                userId: localStorage.getItem('youtube_user_id')
            }).$promise.then(function (data) {
                return data.list;
            });
        }

        $scope.AddToPlaylist = function (index) {
            var inP = $scope.list.items[index].inPlaylist;
            if (inP == undefined || inP == false) {
                $scope.list.items[index].inPlaylist = true;
                GetPlaylistId(index);
            } else {
                $scope.list.items[index].inPlaylist = false;
                RemoveFromPlaylist(index);
            }
        }

        function GetPlaylistItem(index, playlistId) {
            var videoId = GetVideoId(index);
            PlaylistItemResource(GetAccessToken()).Get({
                part: 'snippet',
                playlistId: playlistId,
                videoId: videoId,
                maxResults: 50
            }).$promise.then(function (data) {
                if (data.items.length == 0)
                    AddToPlaylist(index, playlistId);
            })
        }

        function AddToPlaylist(index, playlistId) {
            var videoId = GetVideoId(index);
            PlaylistItemResource(GetAccessToken()).Post({
                snippet: {
                    playlistId: playlistId,
                    resourceId: {
                        kind: 'youtube#video',
                        videoId: videoId
                    }
                }
            }).$promise.then(function (data) {
                $scope.list.items[index].playlistItemId = data.id;
                InsertPlaylistItem(data);
                UpdatePlaylist();
            })
        }

        function InsertPlaylistItem(data) {
            PlaylistItemDbResource.Post({
                playlistItemId: data.id,
                playlistId: data.snippet.playlistId,
                videoId: data.snippet.resourceId.videoId,
                accessToken: GetAccessToken()
            });
        }

        function GetVideoId(index) {
            var videoId = $scope.list.items[index].id.videoId;

            if (videoId == undefined && $scope.list.items[index].snippet.resourceId != undefined)
                videoId = $scope.list.items[index].snippet.resourceId.videoId;

            if (videoId == undefined)
                videoId = $scope.list.items[index].id;

            return videoId;
        }

        function RemoveFromPlaylist(index) {
            var playlistItemId = $scope.list.items[index].playlistItemId;
            PlaylistItemResource(GetAccessToken()).Remove({
                id: playlistItemId
            }).$promise.then(function (data) {
                DeletePlaylistItem(playlistItemId);
                UpdatePlaylist();
            });
        }

        function DeletePlaylistItem(id) {
            PlaylistItemDbResource.Delete({
                playlistItemId: id,
                accessToken: GetAccessToken()
            });
        }

        function GetPlaylistId(index) {
            PlaylistDbResource.Get({
                title: $scope.playlist,
                accessToken: GetAccessToken()
            }).$promise.then(function (data) {
                if (data.id != null) {
                    $scope.playlistId = data.id;
                    GetPlaylistItem(index, data.id);
                }
                else
                    CreatePlaylist(index);
            })
        }

        function CreatePlaylist(index) {
            PlaylistResource(GetAccessToken()).Post({
                snippet: {
                    title: $scope.playlist,
                    tags: [$scope.playlist]
                },
                status: {
                    privacyStatus: 'unlisted'
                }
            }).$promise.then(function (data) {
                $scope.playlistId = data.id;
                InsertPlaylist(index, data);
            })
        }

        function InsertPlaylist(index, data) {
            PlaylistDbResource.Post({
                playlistId: data.id,
                title: data.snippet.title,
                thumbnail: data.snippet.thumbnails.default.url,
                tags: data.snippet.tags.toString(),
                published: data.snippet.publishedAt,
                privacy: data.status.privacyStatus,
                accessToken: GetAccessToken()
            }).$promise.then(function () {
                AddToPlaylist(index, data.id);
            });
        }

        function UpdatePlaylist() {
            PlaylistResource(GetAccessToken()).Get({
                id: $scope.playlistId,
                part: 'snippet,status'
            }).$promise.then(function (data) {
                var pl = data.items[0];
                PlaylistDbResource.Put({
                    playlistId: pl.id,
                    title: pl.snippet.title,
                    thumbnail: pl.snippet.thumbnails.default.url,
                    tags: SetTags(pl),
                    published: pl.snippet.publishedAt,
                    privacy: pl.status.privacyStatus,
                    accessToken: GetAccessToken()
                })
            });
        }

        $scope.$watch('playlist', function (value) {
            $scope.playlistId = '';
            if ($scope.list == undefined || $scope.list.items == undefined)
                return;

            var i = 0;
            for (i = 0; i < $scope.list.items.length; i++) {
                $scope.list.items[i].inPlaylist = false;
            }
        });

        function SetTags(pl) {
            if (pl.snippet.tags != undefined)
                return pl.snippet.tags.toString();
            else
                return '[]';
        }

        function GetAccessToken() {
            return localStorage.getItem('youtube_access_token');
        }
    });

Controllers.controller('VideosCtrl',
    function ($scope, $routeParams, SearchResource,
        PlaylistItemResource, PlaylistResource,
        PlaylistItemDbResource, PlaylistDbResource,
        YoutubeSearchResource, AuthenticateResource) {

        //****************************************
        // AUTHENTICATE
        //****************************************

        $scope.needSignIn = false;
        Authenticate();

        function Authenticate() {
          AuthenticateResource.Get({
            accessToken: GetAccessToken(),
            refreshToken: GetRefreshToken()
          })
          .$promise.then(function (data) {
              StoreValues(data);
          }, function (error) {
              $scope.needSignIn = true;
          });
        }

        function StoreValues(data) {
            localStorage.setItem('youtube_access_token', data.access_token);
            localStorage.setItem('youtube_user_id', data.user_id);
            localStorage.setItem('youtube_expires_in', data.expires_in);
            Initialize();
        }

        function GetAccessToken() {
            return localStorage.getItem('youtube_access_token');
        }

        function GetRefreshToken() {
            return localStorage.getItem('youtube_refresh_token');
        }

        //$scope.needSignIn = false;
        //VerifyAccessToken(true);

        //function VerifyAccessToken(refresh) {
        //    VerifyTokenResource.Get({
        //        access_token: GetAccessToken()
        //    }).$promise.then(function (data) {
        //        SetUserId(data);
        //    }, function (error) {
        //        if (refresh)
        //            RefreshToken();
        //        else
        //            $scope.needSignIn = true;
        //    });
        //}

        //function RefreshToken() {
        //    RefreshTokenResource.Get({
        //        refresh_token: GetRefreshToken()
        //    }).$promise.then(function (data) {
        //        SetAccessToken(data);
        //    }, function (error) {
        //        $scope.needSignIn = true;
        //    });
        //}

        //function SetUserId(data) {
        //    localStorage.setItem('youtube_user_id', data.user_id);
        //    localStorage.setItem('youtube_expires_in', data.expires_in);
        //    Initialize();
        //}

        //function SetAccessToken(data) {
        //    localStorage.setItem('youtube_access_token', data.access_token);
        //    VerifyAccessToken(false);
        //}

        //function GetAccessToken() {
        //    return localStorage.getItem('youtube_access_token');
        //}

        //function GetRefreshToken() {
        //    return localStorage.getItem('youtube_refresh_token');
        //}

        //****************************************
        // INITIALIZE
        //****************************************

        function Initialize() {
            $scope.owner = 'me';
            $scope.orderVisible = false;

            var query = $routeParams.query;
            if (query != undefined && query.length > 0)
                $scope.search = query;
            else {
                if (localStorage.getItem('video_search') == undefined)
                    $scope.search = '';
                else
                    $scope.search = localStorage.getItem('video_search');
            }

            if (localStorage.getItem('video_order') == undefined)
                $scope.order = 'relevance';
            else
                $scope.order = localStorage.getItem('video_order');

            Search();
        }

        //****************************************
        // SEARCH
        //****************************************

        $scope.GoSearch = function ($event) {
            var keypressed = $event.keyCode || $event.which;
            if (keypressed == 13)
                Search();
        }

        $scope.Search = function () {
            Search();
        }

        function Search() {
            localStorage.setItem('video_search', $scope.search);
            localStorage.setItem('video_order', $scope.order);

            var query = GetSearch();
            YoutubeSearchResource(GetAccessToken()).Get({
                q: query,
                part: 'snippet',
                order: GetOrder(),
                maxResults: '50',
                type: 'video',
                forMine: 'true'
            }).$promise.then(function (data) {
                $scope.list = data;
                if (query != undefined) {
                    if (data.items.length > 0)
                        InsertSearch(query);
                    else
                        DeleteSearch(query);
                }
            })
        }

        function GetSearch() {
            if ($scope.search == '')
                return undefined;
            else
                return $scope.search;
        }

        function GetOrder() {
            if ($scope.order == '')
                return undefined;
            else
                return $scope.order;
        }

        $scope.SelectOrder = function (value) {
            $scope.order = value;
            Search();
        }

        $scope.$watch('order', function (value) {
            switch (value) {
                case 'relevance':
                    $scope.orderText = 'Relevance';
                    break;

                case 'viewCount':
                    $scope.orderText = 'View Count';
                    break;

                case 'rating':
                    $scope.orderText = 'Rating';
                    break;

                case 'date':
                    $scope.orderText = 'Date';
                    break;

                case 'title':
                    $scope.orderText = 'Title';
                    break;
            }
        });

        //****************************************
        // SEARCH HINTS
        //****************************************

        $scope.GetSearchList = function (val) {
            return SearchResource.Get({
                query: val,
                type: 'video',
                userId: localStorage.getItem('youtube_user_id')
            }).$promise.then(function (data) {
                return data.list;
            });
        }

        function InsertSearch(query) {
            SearchResource.Post({
                query: query,
                type: 'video',
                accessToken: GetAccessToken()
            });
        }

        function DeleteSearch(query) {
            SearchResource.Delete({
                query: query,
                type: 'video',
                accessToken: GetAccessToken()
            });
        }

        //****************************************
        // ADD TO PLAYLIST
        //****************************************

        $scope.playlistId = '';

        $scope.GetPlaylistHints = function (val) {
            return SearchResource.Get({
                query: val,
                type: 'playlist',
                userId: localStorage.getItem('youtube_user_id')
            }).$promise.then(function (data) {
                return data.list;
            });
        }

        $scope.AddToPlaylist = function (index) {
            var inP = $scope.list.items[index].inPlaylist;
            if (inP == undefined || inP == false) {
                $scope.list.items[index].inPlaylist = true;
                GetPlaylistId(index);
            } else {
                $scope.list.items[index].inPlaylist = false;
                RemoveFromPlaylist(index);
            }
        }

        function GetPlaylistItem(index, playlistId) {
            var videoId = GetVideoId(index);
            PlaylistItemResource(GetAccessToken()).Get({
                part: 'snippet',
                playlistId: playlistId,
                videoId: videoId,
                maxResults: 50
            }).$promise.then(function (data) {
                if (data.items.length == 0)
                    AddToPlaylist(index, playlistId);
            })
        }

        function AddToPlaylist(index, playlistId) {
            var videoId = GetVideoId(index);
            PlaylistItemResource(GetAccessToken()).Post({
                snippet: {
                    playlistId: playlistId,
                    resourceId: {
                        kind: 'youtube#video',
                        videoId: videoId
                    }
                }
            }).$promise.then(function (data) {
                $scope.list.items[index].playlistItemId = data.id;
                InsertPlaylistItem(data);
                UpdatePlaylist();
            })
        }

        function InsertPlaylistItem(data) {
            PlaylistItemDbResource.Post({
                playlistItemId: data.id,
                playlistId: data.snippet.playlistId,
                videoId: data.snippet.resourceId.videoId,
                accessToken: GetAccessToken()
            });
        }

        function GetVideoId(index) {
            var videoId = $scope.list.items[index].id.videoId;

            if (videoId == undefined && $scope.list.items[index].snippet.resourceId != undefined)
                videoId = $scope.list.items[index].snippet.resourceId.videoId;

            if (videoId == undefined)
                videoId = $scope.list.items[index].id;

            return videoId;
        }

        function RemoveFromPlaylist(index) {
            var playlistItemId = $scope.list.items[index].playlistItemId;
            PlaylistItemResource(GetAccessToken()).Remove({
                id: playlistItemId
            }).$promise.then(function (data) {
                DeletePlaylistItem(playlistItemId);
                UpdatePlaylist();
            });
        }

        function DeletePlaylistItem(id) {
            PlaylistItemDbResource.Delete({
                playlistItemId: id,
                accessToken: GetAccessToken()
            });
        }

        function GetPlaylistId(index) {
            PlaylistDbResource.Get({
                title: $scope.playlist,
                accessToken: GetAccessToken()
            }).$promise.then(function (data) {
                if (data.id != null) {
                    $scope.playlistId = data.id;
                    GetPlaylistItem(index, data.id);
                }
                else
                    CreatePlaylist(index);
            })
        }

        function CreatePlaylist(index) {
            PlaylistResource(GetAccessToken()).Post({
                snippet: {
                    title: $scope.playlist,
                    tags: [$scope.playlist]
                },
                status: {
                    privacyStatus: 'unlisted'
                }
            }).$promise.then(function (data) {
                $scope.playlistId = data.id;
                InsertPlaylist(index, data);
            })
        }

        function InsertPlaylist(index, data) {
            PlaylistDbResource.Post({
                playlistId: data.id,
                title: data.snippet.title,
                thumbnail: data.snippet.thumbnails.default.url,
                tags: data.snippet.tags.toString(),
                published: data.snippet.publishedAt,
                privacy: data.status.privacyStatus,
                accessToken: GetAccessToken()
            }).$promise.then(function () {
                AddToPlaylist(index, data.id);
            });
        }

        function UpdatePlaylist() {
            PlaylistResource(GetAccessToken()).Get({
                id: $scope.playlistId,
                part: 'snippet,status'
            }).$promise.then(function (data) {
                var pl = data.items[0];
                PlaylistDbResource.Put({
                    playlistId: pl.id,
                    title: pl.snippet.title,
                    thumbnail: pl.snippet.thumbnails.default.url,
                    tags: SetTags(pl),
                    published: pl.snippet.publishedAt,
                    privacy: pl.status.privacyStatus,
                    accessToken: GetAccessToken()
                })
            });
        }

        $scope.$watch('playlist', function (value) {
            $scope.playlistId = '';
            if ($scope.list == undefined || $scope.list.items == undefined)
                return;

            var i = 0;
            for (i = 0; i < $scope.list.items.length; i++) {
                $scope.list.items[i].inPlaylist = false;
            }
        });

        function SetTags(pl) {
            if (pl.snippet.tags != undefined)
                return pl.snippet.tags.toString();
            else
                return '[]';
        }

        function GetAccessToken() {
            return localStorage.getItem('youtube_access_token');
        }
    });

Controllers.controller('RecommendCtrl',
    function ($scope, $routeParams, $location, SearchResource,
        PlaylistItemResource, PlaylistResource, VideoResource,
        PlaylistDbResource, YoutubeSearchResource,
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
          })
          .$promise.then(function (data) {
              StoreValues(data);
          }, function (error) {
              $scope.needSignIn = true;
          });
        }

        function StoreValues(data) {
            localStorage.setItem('youtube_access_token', data.access_token);
            localStorage.setItem('youtube_user_id', data.user_id);
            localStorage.setItem('youtube_expires_in', data.expires_in);
            Initialize();
        }

        function GetAccessToken() {
            return localStorage.getItem('youtube_access_token');
        }

        function GetRefreshToken() {
            return localStorage.getItem('youtube_refresh_token');
        }

        //****************************************
        // INITIALIZE
        //****************************************

        function Initialize() {
            $scope.owner = 'yt';
            $scope.videoId = $routeParams.id;

            GetVideoList();
        }

        function GetVideoList() {
            var access_token = localStorage.getItem('youtube_access_token');
            YoutubeSearchResource(access_token).Get({
                part: 'snippet',
                maxResults: '49',
                type: 'video',
                relatedToVideoId: $routeParams.id
            }).$promise.then(function (data) {
                $scope.list = data;
                GetVideo();
            })
        }

        function GetVideo() {
            var access_token = localStorage.getItem('youtube_access_token');
            VideoResource(access_token).Get({
                part: 'snippet',
                id: $routeParams.id
            }).$promise.then(function (data) {
                $scope.heading = data.items[0].snippet.title;
                $scope.list.items.splice(0, 0, data.items[0]);
            })
        }

        //****************************************
        // ADD TO PLAYLIST
        //****************************************

        $scope.playlistId = '';

        $scope.GetPlaylistHints = function (val) {
            return SearchResource.Get({
                query: val,
                type: 'playlist',
                userId: localStorage.getItem('youtube_user_id')
            }).$promise.then(function (data) {
                return data.list;
            });
        }

        $scope.AddToPlaylist = function (index) {
            var inP = $scope.list.items[index].inPlaylist;
            if (inP == undefined || inP == false) {
                $scope.list.items[index].inPlaylist = true;
                GetPlaylistId(index);
            } else {
                $scope.list.items[index].inPlaylist = false;
                RemoveFromPlaylist(index);
            }
        }

        function GetPlaylistItem(index, playlistId) {
            var videoId = GetVideoId(index);
            PlaylistItemResource(GetAccessToken()).Get({
                part: 'snippet',
                playlistId: playlistId,
                videoId: videoId,
                maxResults: 50
            }).$promise.then(function (data) {
                if (data.items.length == 0)
                    AddToPlaylist(index, playlistId);
            })
        }

        function AddToPlaylist(index, playlistId) {
            var videoId = GetVideoId(index);
            PlaylistItemResource(GetAccessToken()).Post({
                snippet: {
                    playlistId: playlistId,
                    resourceId: {
                        kind: 'youtube#video',
                        videoId: videoId
                    }
                }
            }).$promise.then(function (data) {
                $scope.list.items[index].playlistItemId = data.id;
                InsertPlaylistItem(data);
                UpdatePlaylist();
            })
        }

        function InsertPlaylistItem(data) {
            PlaylistItemDbResource.Post({
                playlistItemId: data.id,
                playlistId: data.snippet.playlistId,
                videoId: data.snippet.resourceId.videoId,
                accessToken: GetAccessToken()
            });
        }

        function GetVideoId(index) {
            var videoId = $scope.list.items[index].id.videoId;

            if (videoId == undefined && $scope.list.items[index].snippet.resourceId != undefined)
                videoId = $scope.list.items[index].snippet.resourceId.videoId;

            if (videoId == undefined)
                videoId = $scope.list.items[index].id;

            return videoId;
        }

        function RemoveFromPlaylist(index) {
            var playlistItemId = $scope.list.items[index].playlistItemId;
            PlaylistItemResource(GetAccessToken()).Remove({
                id: playlistItemId
            }).$promise.then(function (data) {
                DeletePlaylistItem(playlistItemId);
                UpdatePlaylist();
            });
        }

        function DeletePlaylistItem(id) {
            PlaylistItemDbResource.Delete({
                playlistItemId: id,
                accessToken: GetAccessToken()
            });
        }

        function GetPlaylistId(index) {
            PlaylistDbResource.Get({
                title: $scope.playlist,
                accessToken: GetAccessToken()
            }).$promise.then(function (data) {
                if (data.id != null) {
                    $scope.playlistId = data.id;
                    GetPlaylistItem(index, data.id);
                }
                else
                    CreatePlaylist(index);
            })
        }

        function CreatePlaylist(index) {
            PlaylistResource(GetAccessToken()).Post({
                snippet: {
                    title: $scope.playlist,
                    tags: [$scope.playlist]
                },
                status: {
                    privacyStatus: 'unlisted'
                }
            }).$promise.then(function (data) {
                $scope.playlistId = data.id;
                InsertPlaylist(index, data);
            })
        }

        function InsertPlaylist(index, data) {
            PlaylistDbResource.Post({
                playlistId: data.id,
                title: data.snippet.title,
                thumbnail: data.snippet.thumbnails.default.url,
                tags: data.snippet.tags.toString(),
                published: data.snippet.publishedAt,
                privacy: data.status.privacyStatus,
                accessToken: GetAccessToken()
            }).$promise.then(function () {
                AddToPlaylist(index, data.id);
            });
        }

        function UpdatePlaylist() {
            PlaylistResource(GetAccessToken()).Get({
                id: $scope.playlistId,
                part: 'snippet,status'
            }).$promise.then(function (data) {
                var pl = data.items[0];
                PlaylistDbResource.Put({
                    playlistId: pl.id,
                    title: pl.snippet.title,
                    thumbnail: pl.snippet.thumbnails.default.url,
                    tags: SetTags(pl),
                    published: pl.snippet.publishedAt,
                    privacy: pl.status.privacyStatus,
                    accessToken: GetAccessToken()
                })
            });
        }

        $scope.$watch('playlist', function (value) {
            $scope.playlistId = '';
            if ($scope.list == undefined || $scope.list.items == undefined)
                return;

            var i = 0;
            for (i = 0; i < $scope.list.items.length; i++) {
                $scope.list.items[i].inPlaylist = false;
            }
        });

        function SetTags(pl) {
            if (pl.snippet.tags != undefined)
                return pl.snippet.tags.toString();
            else
                return '[]';
        }
    });

Controllers.controller('PlaylistsCtrl',
    function ($scope, $routeParams,
        ImportPlaylistResource, PlaylistDbResource,
        SearchResource, AuthenticateResource) {

        //****************************************
        // AUTHENTICATE
        //****************************************

        $scope.needSignIn = false;
        Authenticate();

        function Authenticate() {
          AuthenticateResource.Get({
            accessToken: GetAccessToken(),
            refreshToken: GetRefreshToken()
          })
          .$promise.then(function (data) {
              StoreValues(data);
          }, function (error) {
              $scope.needSignIn = true;
          });
        }

        function StoreValues(data) {
            localStorage.setItem('youtube_access_token', data.access_token);
            localStorage.setItem('youtube_user_id', data.user_id);
            localStorage.setItem('youtube_expires_in', data.expires_in);
            Initialize();
        }

        function GetAccessToken() {
            return localStorage.getItem('youtube_access_token');
        }

        function GetRefreshToken() {
            return localStorage.getItem('youtube_refresh_token');
        }

        //****************************************
        // INITIALIZE
        //****************************************

        function Initialize() {

            var query = $routeParams.query;
            if (query != undefined && query.length > 0)
                $scope.search = query;
            else {
                if (localStorage.getItem('playlist_search') == undefined)
                    $scope.search = '';
                else
                    $scope.search = localStorage.getItem('playlist_search');
            }

            if (localStorage.getItem('playlist_order') == undefined)
                $scope.order = 'date';
            else
                $scope.order = localStorage.getItem('playlist_order');

            Search();
        }

        //*********************************************
        // Search
        //*********************************************

        $scope.GoSearch = function ($event) {
            var keypressed = $event.keyCode || $event.which;
            if (keypressed == 13)
                Search();
        }

        $scope.Search = function () {
            Search();
        }

        function Search() {
            localStorage.setItem('playlist_search', $scope.search);
            localStorage.setItem('playlist_order', $scope.order);

            var query = $scope.search;
            PlaylistDbResource.Get({
                query: query,
                order: GetOrder(),
                accessToken: GetAccessToken()
            }).$promise.then(function (data) {
                $scope.items = data;
                if (query != '') {
                    if (data.list.length > 0)
                        InsertSearch(query);
                    else
                        DeleteSearch(query);
                }
            });
        }

        function GetOrder() {
            if ($scope.order == '') {
                $scope.order = 'date';
                return 'date';
            }
            else
                return $scope.order;
        }

        $scope.SelectOrder = function (value) {
            $scope.order = value;
            Search();
        }

        $scope.$watch('order', function (value) {
            switch(value) {

                case 'date':
                    $scope.orderText = 'Date';
                    break;

                case 'title':
                    $scope.orderText = 'Title';
                    break;
            }
        });

        //*********************************************
        // Import
        //*********************************************

        $scope.Import = function () {
            SetAlert('warning', 'Importing playlists...');

            ImportPlaylistResource.Post({
                job: 'false',
                accessToken: GetAccessToken()
            }).$promise.then(function (data) {
                $scope.response = data.message;
                if (data.success) {
                    SetAlert('success', 'Playlist import successful.');
                    Search();
                } else
                    SetAlert('danger', 'Playlist import failed.');
            });
        }

        $scope.closeAlert = function (index) {
            $scope.alerts.splice(index, 1);
        };

        function SetAlert(type, msg) {
            $scope.alerts = [{ type: type, msg: msg }];
        }

        //*********************************************
        // Search Suggestions
        //*********************************************

        $scope.GetSearchList = function (val) {
            return SearchResource.Get({
                query: val,
                type: 'playlist',
                userId: localStorage.getItem('youtube_user_id')
            }).$promise.then(function (data) {
                return data.list;
            });
        }

        function InsertSearch(query) {
            SearchResource.Post({
                query: query,
                type: 'playlist',
                accessToken: GetAccessToken()
            });
        }

        function DeleteSearch(query) {
            SearchResource.Delete({
                query: query,
                type: 'playlist',
                accessToken: GetAccessToken()
            });
        }

    });

Controllers.controller('ToolsCtrl',
    function ($scope, $routeParams,
        ImportVideoResource, ImportPlaylistItemResource,
        AuthenticateResource) {

        //****************************************
        // AUTHENTICATE
        //****************************************

        $scope.needSignIn = false;
        Authenticate();

        function Authenticate() {
          AuthenticateResource.Get({
            accessToken: GetAccessToken(),
            refreshToken: GetRefreshToken()
          })
          .$promise.then(function (data) {
              StoreValues(data);
          }, function (error) {
              $scope.needSignIn = true;
          });
        }

        function StoreValues(data) {
            localStorage.setItem('youtube_access_token', data.access_token);
            localStorage.setItem('youtube_user_id', data.user_id);
            localStorage.setItem('youtube_expires_in', data.expires_in);
            //Initialize();
        }

        function GetAccessToken() {
            return localStorage.getItem('youtube_access_token');
        }

        function GetRefreshToken() {
            return localStorage.getItem('youtube_refresh_token');
        }

        //*********************************************
        // Import
        //*********************************************

        $scope.ImportVideos = function () {
            SetAlert('warning', 'Importing videos...');
            ImportVideoResource.Post({
                job: 'false',
                accessToken: GetAccessToken()
            }).$promise.then(function (data) {
                if (data.success) {
                    SetAlert('success', 'Video import successful.');
                } else
                    SetAlert('danger', 'Video import failed.');
            });
        }

        $scope.ImportPlaylistItems = function () {
            SetAlert('warning', 'Importing playlist items...');
            ImportPlaylistItemResource.Post({
                job: 'false',
                accessToken: GetAccessToken()
            }).$promise.then(function (data) {
                if (data.success) {
                    SetAlert('success', 'Playlist item import successful.');
                } else
                    SetAlert('danger', 'Playlist item import failed.');
            });
        }

        $scope.closeAlert = function (index) {
            $scope.alerts.splice(index, 1);
        };

        function SetAlert(type, msg) {
            $scope.alerts = [{ type: type, msg: msg }];
        }
    });

Controllers.controller('PlaylistCtrl',
    function ($scope, $routeParams, $window, PlaylistResource, PlaylistItemResource,
        PlaylistDbResource, AuthenticateResource) {

        //****************************************
        // AUTHENTICATE
        //****************************************

        $scope.needSignIn = false;
        Authenticate();

        function Authenticate() {
          AuthenticateResource.Get({
            accessToken: GetAccessToken(),
            refreshToken: GetRefreshToken()
          })
          .$promise.then(function (data) {
              StoreValues(data);
          }, function (error) {
              $scope.needSignIn = true;
          });
        }

        function StoreValues(data) {
            localStorage.setItem('youtube_access_token', data.access_token);
            localStorage.setItem('youtube_user_id', data.user_id);
            localStorage.setItem('youtube_expires_in', data.expires_in);
            Initialize();
        }

        function GetAccessToken() {
            return localStorage.getItem('youtube_access_token');
        }

        function GetRefreshToken() {
            return localStorage.getItem('youtube_refresh_token');
        }

        //****************************************
        // INITIALIZE
        //****************************************

        function Initialize() {

            $scope.emtpyPlaylist = false;
            $scope.notFound = false;
            $scope.playlistError = false;

            $scope.id = $routeParams.id;
            $scope.owner = $routeParams.owner;
            if ($routeParams.owner == 'me') {
                $scope.playlistType = 'playlist';
                $scope.playBtn = 'Play All / Edit';
            } else {
                $scope.playlistType = 'playlist-items';
                $scope.playBtn = 'Play All';
            }

            GetPlaylist();
            GetPlaylistItems();
        }

        function GetPlaylist() {
            PlaylistResource(GetAccessToken()).Get({
                id: $routeParams.id,
                part: 'snippet,status'
            }).$promise.then(function (data) {
                if (data.items.length > 0)
                    $scope.playlist = data;
                else
                    $scope.notFound = true;
            }, function (error) {
                $scope.playlistError = true;
                //$scope.list.items = [];
            })
        }

        function GetPlaylistItems() {
            PlaylistItemResource(GetAccessToken()).Get({
                playlistId: $routeParams.id,
                maxResults: '50',
                part: 'snippet'
            }).$promise.then(function (data) {
                if (data.items.length > 0)
                    $scope.list = data;
                else
                    $scope.emptyPlaylist = true;
            }, function (error) {
                $scope.playlistError = true;
                //$scope.list.items = [];
            })
        }

        $scope.Back = function () {
            $window.history.back();
        }

        $scope.Reload = function () {
            $window.location.reload();
        }

        $scope.Delete = function () {
            PlaylistResource(GetAccessToken()).Delete({
                id: $routeParams.id
            }).$promise.then(function (data) {
                // TODO: Handle Errors Here

                PlaylistDbResource.Delete({
                    id: $routeParams.id,
                    accessToken: GetAccessToken()
                }).$promise.then(function () {
                    $window.history.back();
                })
            })
        }

        $scope.Remove = function (index) {
            PlaylistItemResource(GetAccessToken()).Delete({
                id: $scope.list.items[index].id
            }).$promise.then(function (data) {
                $scope.list.items.splice(index, 1);
                UpdatePlaylist();
                if ($scope.list.items.length == 0)
                    $scope.emptyPlaylist = true;
            })
        }

        $scope.MoveUp = function (index) {
            PlaylistItemResource(GetAccessToken()).Put({
                id: $scope.list.items[index].id,
                snippet: {
                    playlistId: $routeParams.id,
                    resourceId: {
                        videoId: $scope.list.items[index].snippet.resourceId.videoId,
                        kind: 'youtube#video'
                    },
                    position: index - 1
                }
            }).$promise.then(function (data) {
                var item = $scope.list.items.splice(index, 1);
                $scope.list.items.splice(index - 1, 0, item[0]);
                UpdatePlaylist();
            })
        }

        $scope.MoveDown = function (index) {
            PlaylistItemResource(GetAccessToken()).Put({
                id: $scope.list.items[index].id,
                snippet: {
                    playlistId: $routeParams.id,
                    resourceId: {
                        videoId: $scope.list.items[index].snippet.resourceId.videoId,
                        kind: 'youtube#video'
                    },
                    position: index + 1
                }
            }).$promise.then(function (data) {
                var item = $scope.list.items.splice(index, 1);
                $scope.list.items.splice(index + 1, 0, item[0]);
                UpdatePlaylist();
            })
        }

        $scope.select = function (item) {
            //var selected = item.Selected;

            var i = 0;
            for (i = 0; i < $scope.list.items.length; i++) {
                $scope.list.items[i].Selected = 0;
            }

            if (item.Selected == 0)
                item.Selected = 1;
            else
                item.Selected = 0;
        };

        function UpdatePlaylist() {
            PlaylistResource(GetAccessToken()).Get({
                id: $routeParams.id,
                part: 'snippet,status'
            }).$promise.then(function (data) {
                var pl = data.items[0];
                PlaylistDbResource.Put({
                    playlistId: pl.id,
                    title: pl.snippet.title,
                    thumbnail: pl.snippet.thumbnails.default.url,
                    tags: SetTags(pl),
                    published: pl.snippet.publishedAt,
                    privacy: pl.status.privacyStatus,
                    accessToken: GetAccessToken()
                })
            })
        }

        function SetTags(pl) {
            if (pl.snippet.tags != undefined)
                return pl.snippet.tags.toString();
            else
                return '[]';
        }

        //function GetError(item) {
        //    if (item.status.rejectionReason != undefined)
        //        return item.status.rejectionReason;
        //    else
        //        return '';
        //}

        function GetAccessToken() {
            return localStorage.getItem('youtube_access_token');
        }
    });

Controllers.controller('TagsCtrl',
    function ($scope, $routeParams, SearchResource,
        AuthenticateResource) {

        //****************************************
        // AUTHENTICATE
        //****************************************

        $scope.needSignIn = false;
        Authenticate();

        function Authenticate() {
            AuthenticateResource.Get({
              accessToken: GetAccessToken(),
              refreshToken: GetRefreshToken()
            })
            .$promise.then(function (data) {
                StoreValues(data);
            }, function (error) {
                $scope.needSignIn = true;
            });
        }

        function StoreValues(data) {
            localStorage.setItem('youtube_access_token', data.access_token);
            localStorage.setItem('youtube_user_id', data.user_id);
            localStorage.setItem('youtube_expires_in', data.expires_in);
            Initialize();
        }

        function GetAccessToken() {
            return localStorage.getItem('youtube_access_token');
        }

        function GetRefreshToken() {
            return localStorage.getItem('youtube_refresh_token');
        }

        //****************************************
        // INITIALIZE
        //****************************************

        function Initialize() {

            $scope.search = '';

            $scope.heading = GetHeading();
            $scope.path = GetPath();

            if (!localStorage.getItem('tag_search'))
                $scope.search = '';
            else
                $scope.search = localStorage.getItem('tag_search');

            $scope.items = SearchResource.Get({
                type: GetType(),
                userId: localStorage.getItem('youtube_user_id')
            });
        }

        $scope.StoreFilter = function () {
            localStorage.setItem('tag_search', $scope.search);
        }

        $scope.ClearFilter = function () {
            $scope.search = '';
            localStorage.setItem('tag_search', '');
        }

        $scope.Delete = function (item) {
            var index = $scope.items.list.indexOf(item);
            $scope.items.list.splice(index, 1);
            SearchResource.Delete({
                query: item.title,
                type: GetType(),
                accessToken: GetAccessToken()
            });
        }

        function IsVideo() {
            if ($routeParams.type == 'video')
                return true;
            else
                return false
        }

        function GetType() {
            if (IsVideo())
                return 'video';
            else
                return 'playlist';
        }

        function GetHeading() {
            if (IsVideo())
                return 'Video Tags';
            else
                return 'Playlist Tags';
        }

        function GetPath() {
            if (IsVideo())
                return 'my-videos';
            else
                return 'my-playlists';
        }
    });

Controllers.controller('SubscriptionsCtrl',
    function ($scope, $routeParams, SubscriptionResource,
        AuthenticateResource) {

        //****************************************
        // AUTHENTICATE
        //****************************************

        $scope.needSignIn = false;
        Authenticate();

        function Authenticate() {
          AuthenticateResource.Get({
            accessToken: GetAccessToken(),
            refreshToken: GetRefreshToken()
          })
          .$promise.then(function (data) {
              StoreValues(data);
          }, function (error) {
              $scope.needSignIn = true;
          });
        }

        function StoreValues(data) {
            localStorage.setItem('youtube_access_token', data.access_token);
            localStorage.setItem('youtube_user_id', data.user_id);
            localStorage.setItem('youtube_expires_in', data.expires_in);
            Initialize();
        }

        function GetAccessToken() {
            return localStorage.getItem('youtube_access_token');
        }

        function GetRefreshToken() {
            return localStorage.getItem('youtube_refresh_token');
        }

        //****************************************
        // INITIALIZE
        //****************************************

        function Initialize() {

            var access_token = localStorage.getItem('youtube_access_token');
            $scope.list = SubscriptionResource(access_token).Get({
                part: 'snippet,contentDetails',
                maxResults: '50',
                mine: 'true'
            });
        }
    });

Controllers.controller('ChannelCtrl',
    function ($scope, $routeParams, ChannelResource,
        AuthenticateResource) {

        //****************************************
        // AUTHENTICATE
        //****************************************

        $scope.needSignIn = false;
        Authenticate();

        function Authenticate() {
          AuthenticateResource.Get({
            accessToken: GetAccessToken(),
            refreshToken: GetRefreshToken()
          })
          .$promise.then(function (data) {
              StoreValues(data);
          }, function (error) {
              $scope.needSignIn = true;
          });
        }

        function StoreValues(data) {
            localStorage.setItem('youtube_access_token', data.access_token);
            localStorage.setItem('youtube_user_id', data.user_id);
            localStorage.setItem('youtube_expires_in', data.expires_in);
            Initialize();
        }

        function GetAccessToken() {
            return localStorage.getItem('youtube_access_token');
        }

        function GetRefreshToken() {
            return localStorage.getItem('youtube_refresh_token');
        }

        //****************************************
        // INITIALIZE
        //****************************************

        function Initialize() {

            var access_token = localStorage.getItem('youtube_access_token');
            $scope.list = ChannelResource(access_token).Get({
                part: 'snippet,contentDetails',
                maxResults: '50',
                mine: 'true'
            });
        }
    });

Controllers.controller('ActivityCtrl',
    function ($scope, $routeParams, ChannelResource, PlaylistItemResource, SubscriptionResource,
        PlaylistResource, SearchResource, AuthenticateResource) {

        //****************************************
        // AUTHENTICATE
        //****************************************

        $scope.needSignIn = false;
        Authenticate();

        function Authenticate() {
          AuthenticateResource.Get({
            accessToken: GetAccessToken(),
            refreshToken: GetRefreshToken()
          })
          .$promise.then(function (data) {
              StoreValues(data);
          }, function (error) {
              $scope.needSignIn = true;
          });
        }

        function StoreValues(data) {
            localStorage.setItem('youtube_access_token', data.access_token);
            localStorage.setItem('youtube_user_id', data.user_id);
            localStorage.setItem('youtube_expires_in', data.expires_in);
            Initialize();
        }

        function GetAccessToken() {
            return localStorage.getItem('youtube_access_token');
        }

        function GetRefreshToken() {
            return localStorage.getItem('youtube_refresh_token');
        }

        //****************************************
        // INITIALIZE
        //****************************************

        function Initialize() {

            $scope.btnVisible = ($routeParams.owner == 'yt')
            $scope.owner = $routeParams.owner;
            $scope.subscriptionId = '-1';

            GetChannel();
            GetSubscription();
        }

        function GetChannel() {
            var access_token = localStorage.getItem('youtube_access_token');
            ChannelResource(access_token).Get({
                part: 'snippet,contentDetails',
                id: $routeParams.channelId,
            }).$promise.then(function (data) {
                $scope.heading = data.items[0].snippet.title;
                GetPlaylistItems(data.items[0].contentDetails.relatedPlaylists.uploads);
            });
        }

        function GetPlaylistItems(playlistId) {
            var access_token = localStorage.getItem('youtube_access_token');
            $scope.list = PlaylistItemResource(access_token).Get({
                playlistId: playlistId,
                part: 'snippet',
                maxResults: '50'
            });
        }

        function GetSubscription() {
            var access_token = localStorage.getItem('youtube_access_token');
            SubscriptionResource(access_token).Get({
                part: 'snippet',
                forChannelId: $routeParams.channelId,
                mine: 'true'
            }).$promise.then(function (data) {
                if (data.items.length > 0) {
                    SetMode(data.items[0].id);
                } else
                    SetMode('-1');
            });
        }

        $scope.Subscribe = function () {
            var access_token = localStorage.getItem('youtube_access_token');
            if ($scope.subscribed) {
                SubscriptionResource(access_token).Delete({
                    id: $scope.subscriptionId
                }).$promise.then(function (data) {
                    SetMode('-1');
                });
            } else {
                SubscriptionResource(access_token).Post({
                    snippet: { resourceId: { channelId: $routeParams.channelId } }
                }).$promise.then(function (data) {
                    SetMode(data.id);
                });
            }
        }

        function SetMode(subscriptionId) {
            $scope.subscriptionId = subscriptionId;
            if (subscriptionId == -1) {
                $scope.btnIcon = 'glyphicon glyphicon-play';
                $scope.btnText = 'Subscribe';
                $scope.subscribed = false;
            } else {
                $scope.btnIcon = 'glyphicon glyphicon-remove';
                $scope.btnText = 'Unsubscribe';
                $scope.subscribed = true;
            }
        }

        //****************************************
        // ADD TO PLAYLIST
        //****************************************

        $scope.playlistId = '';

        $scope.GetPlaylistHints = function (val) {
            return SearchResource.Get({
                query: val,
                type: 'playlist',
                userId: localStorage.getItem('youtube_user_id')
            }).$promise.then(function (data) {
                return data.list;
            });
        }

        $scope.AddToPlaylist = function (index) {
            var inP = $scope.list.items[index].inPlaylist;
            if (inP == undefined || inP == false) {
                $scope.list.items[index].inPlaylist = true;
                GetPlaylistId(index);
            } else {
                $scope.list.items[index].inPlaylist = false;
                RemoveFromPlaylist(index);
            }
        }

        function GetPlaylistItem(index, playlistId) {
            var videoId = GetVideoId(index);
            PlaylistItemResource(GetAccessToken()).Get({
                part: 'snippet',
                playlistId: playlistId,
                videoId: videoId,
                maxResults: 50
            }).$promise.then(function (data) {
                if (data.items.length == 0)
                    AddToPlaylist(index, playlistId);
            })
        }

        function AddToPlaylist(index, playlistId) {
            var videoId = GetVideoId(index);
            PlaylistItemResource(GetAccessToken()).Post({
                snippet: {
                    playlistId: playlistId,
                    resourceId: {
                        kind: 'youtube#video',
                        videoId: videoId
                    }
                }
            }).$promise.then(function (data) {
                $scope.list.items[index].playlistItemId = data.id;
                InsertPlaylistItem(data);
                UpdatePlaylist();
            })
        }

        function InsertPlaylistItem(data) {
            PlaylistItemResource(GetAccessToken()).Post({
                playlistItemId: data.id,
                playlistId: data.snippet.playlistId,
                videoId: data.snippet.resourceId.videoId
            });
        }

        function GetVideoId(index) {
            var videoId = $scope.list.items[index].id.videoId;

            if (videoId == undefined && $scope.list.items[index].snippet.resourceId != undefined)
                videoId = $scope.list.items[index].snippet.resourceId.videoId;

            if (videoId == undefined)
                videoId = $scope.list.items[index].id;

            return videoId;
        }

        function RemoveFromPlaylist(index) {
            var playlistItemId = $scope.list.items[index].playlistItemId;
            PlaylistItemResource(GetAccessToken()).Remove({
                id: playlistItemId
            }).$promise.then(function (data) {
                DeletePlaylistItem(playlistItemId);
                UpdatePlaylist();
            });
        }

        function DeletePlaylistItem(id) {
            PlaylistItemDbResource.Delete({
                playlistItemId: id,
                accessToken: GetAccessToken()
            });
        }

        function GetPlaylistId(index) {
            PlaylistDbResource.Get({
                title: $scope.playlist,
                accessToken: GetAccessToken()
            }).$promise.then(function (data) {
                if (data.id != null) {
                    $scope.playlistId = data.id;
                    GetPlaylistItem(index, data.id);
                }
                else
                    CreatePlaylist(index);
            })
        }

        function CreatePlaylist(index) {
            PlaylistResource(GetAccessToken()).Post({
                snippet: {
                    title: $scope.playlist,
                    tags: [$scope.playlist]
                },
                status: {
                    privacyStatus: 'unlisted'
                }
            }).$promise.then(function (data) {
                $scope.playlistId = data.id;
                InsertPlaylist(index, data);
            })
        }

        function InsertPlaylist(index, data) {
            PlaylistDbResource.Post({
                playlistId: data.id,
                title: data.snippet.title,
                thumbnail: data.snippet.thumbnails.default.url,
                tags: data.snippet.tags.toString(),
                published: data.snippet.publishedAt,
                privacy: data.status.privacyStatus,
                accessToken: GetAccessToken()
            }).$promise.then(function () {
                AddToPlaylist(index, data.id);
            });
        }

        function UpdatePlaylist() {
            PlaylistResource(GetAccessToken()).Get({
                id: $scope.playlistId,
                part: 'snippet,status'
            }).$promise.then(function (data) {
                var pl = data.items[0];
                PlaylistDbResource.Put({
                    playlistId: pl.id,
                    title: pl.snippet.title,
                    thumbnail: pl.snippet.thumbnails.default.url,
                    tags: SetTags(pl),
                    published: pl.snippet.publishedAt,
                    privacy: pl.status.privacyStatus,
                    accessToken: GetAccessToken()
                })
            });
        }

        $scope.$watch('playlist', function (value) {
            $scope.playlistId = '';
            if ($scope.list == undefined || $scope.list.items == undefined)
                return;

            var i = 0;
            for (i = 0; i < $scope.list.items.length; i++) {
                $scope.list.items[i].inPlaylist = false;
            }
        });

        function SetTags(pl) {
            if (pl.snippet.tags != undefined)
                return pl.snippet.tags.toString();
            else
                return '[]';
        }

        function GetAccessToken() {
            return localStorage.getItem('youtube_access_token');
        }
    });






Controllers.controller('ActivityAllCtrl',
    function ($scope, $routeParams,
        SubscriptionResource, ChannelResource, PlaylistItemResource) {

        $scope.list = { items: [] };

        GetSubscriptions();

        function GetSubscriptions() {
            var access_token = localStorage.getItem('youtube_access_token');
            SubscriptionResource(access_token).Get({
                part: 'snippet',
                maxResults: '50',
                mine: 'true'
            }).$promise.then(function (data) {
                BuildChannelIdList(data.items);
            });
        }

        function BuildChannelIdList(items) {
            var channelIds = [];
            var i = 0;
            for (i = 0; i < items.length; i++) {
                channelIds.push(items[i].snippet.resourceId.channelId)
            }

            GetUploadActivity(channelIds);
        }

        function GetUploadActivity(channelIds) {
            var access_token = localStorage.getItem('youtube_access_token');
            ChannelResource(access_token).Get({
                part: 'contentDetails',
                id: channelIds.toString(),
                maxResults: '50'
            }).$promise.then(function (data) {
                BuildPlaylistIdList(data.items);
            });
        }

        function BuildPlaylistIdList(items) {
            var playlistIds = [];
            var i = 0;
            for (i = 0; i < items.length; i++) {
                playlistIds.push(items[i].contentDetails.relatedPlaylists.uploads)
            }

            GetPlaylistItems(playlistIds);
        }

        function GetPlaylistItems(playlistIds) {
            var playlistItems = [];
            var i = 0;
            for (i = 0; i < playlistIds.length; i++) {
                var access_token = localStorage.getItem('youtube_access_token');
                PlaylistItemResource(access_token).Get({
                    playlistId: playlistIds[i],
                    part: 'snippet',
                    maxResults: '5'
                }).$promise.then(function (data) {
                    ShowData(data.items);
                });
            }
        }

        function ShowData(items) {
            var i = 0;
            for (i = 0; i < items.length; i++) {
                $scope.list.items.push(items[i]);
            }
        }

        function SortData() {
            $scope.list.items.sort(function (a, b) {
                var keyA = a.snippet.publishedAt;
                var keyB = b.snippet.publishedAt;
                if (keyA < keyB)
                    return 1;
                if (keyA > keyB)
                    return -1;
            });
        }

        $scope.Sort = function () {
            SortData();
        }

    });

Controllers.controller('VideosAllCtrl', ['$scope', '$routeParams', 'VideosAllResource',
    function ($scope, $routeParams, VideosAllResource) {

        $scope.search = '';

        if (localStorage.getItem('video_all_search') == undefined)
            $scope.search = '';
        else
            $scope.search = localStorage.getItem('video_all_search');

        $scope.video = VideosAllResource.Get({
            accessToken: localStorage.getItem('youtube_access_token')
        });

        $scope.StoreFilter = function () {
            localStorage.setItem('video_all_search', $scope.search);
        }

        $scope.ClearFilter = function () {
            $scope.search = '';
            localStorage.setItem('video_all_search', '');
        }
    }]);

Controllers.controller('PlaylistsAllCtrl',
    function ($scope, $routeParams, PlaylistDbResource) {

        $scope.search = '';

        if (localStorage.getItem('playlist_all_search') == undefined)
            $scope.search = '';
        else
            $scope.search = localStorage.getItem('playlist_all_search');

        $scope.playlist = PlaylistDbResource.Get({
          accessToken: GetAccessToken()
        });

        $scope.StoreFilter = function () {
            localStorage.setItem('playlist_all_search', $scope.search);
        }

        $scope.ClearFilter = function () {
            $scope.search = '';
            localStorage.setItem('playlist_all_search', '');
        }
    });
