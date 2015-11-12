//*****************************************************************************************************************
// Copyright � 2014 - 2015 Lahuna. All rights reserved.
// You may not copy, reproduce, republish, disassemble, decompile, reverse engineer, post, broadcast, transmit, or
// make available to the public any content or code on this website without prior written permission from Lahuna.
//*****************************************************************************************************************

'use strict';

/* Controllers */

var Controllers = angular.module('Controllers', []);

Controllers.controller('MainCtrl',
  function ($scope, AuthenticateResource, ProfileResource) {

      //****************************************
      // AUTHENTICATE
      //****************************************

      $scope.origin = location.origin;
      $scope.needSignIn = false;
      Authenticate();

      function Authenticate() {
          AuthenticateResource(GetAccessToken(), GetRefreshToken()).Get()
          .$promise.then(function (data) {
              StoreValues(data);
          }, function (error) {
              $scope.needSignIn = true;
          });
      }

      function StoreValues(data) {
          localStorage.setItem("google_access_token", data.access_token);
          localStorage.setItem("google_user_id", data.user_id);
          localStorage.setItem("google_expires_in", data.expires_in);
          GetProfile();
      }

      function GetAccessToken() {
          return localStorage.getItem("google_access_token");
      }

      function GetRefreshToken() {
          return localStorage.getItem("google_refresh_token");
      }

      function GetProfile() {
          ProfileResource(GetAccessToken()).Get()
              .$promise.then(function (data) {
                  $scope.profile = data;
              });
      }
  });

Controllers.controller('PhotosCtrl',
  function ($scope, $routeParams, PicasaResource, AuthenticateResource,
      SearchResource) {

      //****************************************
      // AUTHENTICATE
      //****************************************

      $scope.needSignIn = false;
      Authenticate();

      function Authenticate() {
          AuthenticateResource(GetAccessToken(), GetRefreshToken()).Get()
          .$promise.then(function (data) {
              StoreValues(data);
          }, function (error) {
              $scope.needSignIn = true;
          });
      }

      function StoreValues(data) {
          localStorage.setItem("google_access_token", data.access_token);
          localStorage.setItem("google_user_id", data.user_id);
          localStorage.setItem("google_expires_in", data.expires_in);
          Initialize();
      }

      function GetAccessToken() {
          return localStorage.getItem("google_access_token");
      }

      function GetRefreshToken() {
          return localStorage.getItem("google_refresh_token");
      }

      //****************************************
      // INITIALIZE
      //****************************************

      $scope.startIndex = 1;
      $scope.maxResults = 77;

      var query = $routeParams.query;
      if (query != undefined && query.length > 0)
          $scope.search = query;
      else {
          if (localStorage.getItem("photo_search") == undefined)
              $scope.search = "";
          else
              $scope.search = localStorage.getItem("photo_search");
      }

      $scope.$watch('search', function (value) {
          var path = $scope.startIndex + '/' + $scope.maxResults;
          if (value == '' || value == undefined)
              $scope.path = path;
          else
              $scope.path = value + '/' + path;
      });

      function Initialize() {
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
          localStorage.setItem("photo_search", $scope.search);

          var query = $scope.search;
          PicasaResource(GetAccessToken()).Get({
              'kind': 'photo',
              'q': GetSearch(),
              'start-index': $scope.startIndex,
              'max-results': $scope.maxResults,
              'alt': 'json'
          }).$promise.then(function (data) {
              $scope.list = data;
              if (query != "") {
                  if (data.feed.entry.length > 0)
                      InsertSearch(query);
                  else
                      DeleteSearch(query);
              }
          });
      }

      function GetSearch() {
          if ($scope.search == "")
              return undefined;
          else
              return $scope.search;
      }

      $scope.StoreId = function (photoId) {
          localStorage.setItem('fotoId', photoId);
      }

      //*********************************************
      // Search Suggestions
      //*********************************************

      $scope.GetSearchList = function (val) {
          return SearchResource(GetAccessToken()).Get({
              query: '^' + val,
              type: "photo"
          }).$promise.then(function (data) {
              return data;
          });
      }

      function InsertSearch(query) {
          SearchResource(GetAccessToken()).Post({
              query: query,
              type: "photo"
          });
      }

      function DeleteSearch(query) {
          SearchResource(GetAccessToken()).Delete({
              query: query,
              type: "photo"
          });
      }
  });

Controllers.controller('DetailCtrl',
  function ($scope, $routeParams, PicasaPhotoResource, AlbumResource, AuthenticateResource) {

      //****************************************
      // AUTHENTICATE
      //****************************************

      $scope.needSignIn = false;
      Authenticate();

      function Authenticate() {
          AuthenticateResource(GetAccessToken(), GetRefreshToken()).Get()
          .$promise.then(function (data) {
              StoreValues(data);
          }, function (error) {
              $scope.needSignIn = true;
          });
      }

      function StoreValues(data) {
          localStorage.setItem("google_access_token", data.access_token);
          localStorage.setItem("google_user_id", data.user_id);
          localStorage.setItem("google_expires_in", data.expires_in);
          Initialize();
      }

      function GetAccessToken() {
          return localStorage.getItem("google_access_token");
      }

      function GetRefreshToken() {
          return localStorage.getItem("google_refresh_token");
      }

      //****************************************
      // INITIALIZE
      //****************************************

      function Initialize() {
          PicasaPhotoResource($routeParams.photoId, GetAccessToken()).Get({
              'alt': 'json'
          }).$promise.then(function (data) {
              $scope.photo = data.entry;
              GetAlbum(data.entry.gphoto$albumid.$t)
          });
      }

      function GetAlbum(albumId) {
          AlbumResource.Get({
              albumId: albumId,
              accessToken: GetAccessToken()
          }).$promise.then(function (data) {
              $scope.album = data.entry;
          });
      }
  });

Controllers.controller('SplitCtrl',
  function ($scope, SplitAutoBackupResource, AuthenticateResource) {
      $scope.SplitAutoBackup = function () {

          //****************************************
          // AUTHENTICATE
          //****************************************

          $scope.needSignIn = false;
          Authenticate();

          function Authenticate() {
              AuthenticateResource(GetAccessToken(), GetRefreshToken()).Get()
              .$promise.then(function (data) {
                  StoreValues(data);
              }, function (error) {
                  $scope.needSignIn = true;
              });
          }

          function StoreValues(data) {
              localStorage.setItem("google_access_token", data.access_token);
              localStorage.setItem("google_user_id", data.user_id);
              localStorage.setItem("google_expires_in", data.expires_in);
              Initialize();
          }

          function GetAccessToken() {
              return localStorage.getItem("google_access_token");
          }

          function GetRefreshToken() {
              return localStorage.getItem("google_refresh_token");
          }

          //****************************************
          // INITIALIZE
          //****************************************

          function Initialize() {
              $scope.status = SplitAutoBackupResource.SplitAlbum({
                  accessToken: GetAccessToken(),
                  refreshToken: localStorage.getItem("google_refresh_token"),
              });
          }
      };
  });

Controllers.controller('ImportCtrl',
  function ($scope, ImportAlbumResource, ImportPhotoResource, PicasaResource, AlbumPhotoCountResource, AuthenticateResource,
      AlbumIdResource, DeleteAlbumsResource, DeletePhotosResource, ImportAlbumJobResource, ImportPhotoJobResource, SplitAutoBackupResource) {

      //****************************************
      // AUTHENTICATE
      //****************************************

      $scope.needSignIn = false;
      Authenticate();

      function Authenticate() {
          AuthenticateResource(GetAccessToken(), GetRefreshToken()).Get()
          .$promise.then(function (data) {
              StoreValues(data);
          }, function (error) {
              $scope.needSignIn = true;
          });
      }

      function StoreValues(data) {
          localStorage.setItem("google_access_token", data.access_token);
          localStorage.setItem("google_user_id", data.user_id);
          localStorage.setItem("google_expires_in", data.expires_in);
          Initialize();
      }

      function GetAccessToken() {
          return localStorage.getItem("google_access_token");
      }

      function GetRefreshToken() {
          return localStorage.getItem("google_refresh_token");
      }

      //****************************************
      // INITIALIZE
      //****************************************

      function Initialize() {

      }

      $scope.ImportAlbumJob = function () {
          $scope.status = ImportAlbumJobResource.ImportAlbums({
              accessToken: GetAccessToken(),
              refreshToken: localStorage.getItem("google_refresh_token")
          });
      };

      $scope.ImportPhotoJob = function () {
          $scope.status = ImportPhotoJobResource.ImportPhotos({
              accessToken: GetAccessToken(),
              refreshToken: localStorage.getItem("google_refresh_token")
          });
      };

      $scope.SplitAutoBackup = function () {
          $scope.status = SplitAutoBackupResource.SplitAlbum({
              accessToken: GetAccessToken(),
              refreshToken: localStorage.getItem("google_refresh_token")
          });
      };

      $scope.Import = function () {
          $scope.albumCount = "";
          $scope.albumProgress = "";
          $scope.albumStatus = "";
          $scope.photoCount = "";
          $scope.photoProgress = "";
          $scope.photoStatus = "";

          $scope.albumStatus = "Retrieving album count...";
          PicasaResource(GetAccessToken()).Get({
              'kind': 'album',
              'start-index': '1',
              'max-results': '1',
              'alt': 'json'
            })
          .$promise.then(function (data) {
              $scope.albumCount = data.feed.openSearch.totalResults.$t;
              ImportAlbums();
              //DeleteAlbums();
          });
      };

      //function DeleteAlbums() {
      //    $scope.albumStatus = "Deleting albums...";
      //    DeleteAlbumsResource.Delete()
      //      .$promise.then(function () {
      //          ImportAlbums();
      //      });
      //};

      function ImportAlbums () {
          $scope.albumStatus = "Importing albums...";
          $scope.albumProgress = 0;
          var totalCount = $scope.albumCount;
          var size = 1000;
          var i = 0;
          for (i = 1; i < totalCount; i += size) {
              ImportAlbumResource.ImportAlbums({
                  startIndex: i,
                  maxResults: size,
                  accessToken: GetAccessToken()
              })
              .$promise.then(function (albumsImported) {
                  $scope.albumProgress += albumsImported.albumCount;
                  if ($scope.albumProgress == totalCount) {
                      $scope.albumStatus = "Done";
                      GetAlbumId();
                  }
              });
          }
      };

      function GetAlbumId() {
          $scope.photoStatus = "Retrieving album id...";
          AlbumIdResource.GetAlbumId({
              albumTitle: "Auto Backup",
              accessToken: GetAccessToken()
          })
            .$promise.then(function (data) {
                GetAlbumPhotoCount(data.id);
            });
      };

      function GetAlbumPhotoCount(albumId) {
          $scope.photoStatus = "Retrieving album photo count...";
          AlbumPhotoCountResource.GetAlbumPhotoCount({
              albumId: albumId,
              type: "auto-backup",
              year: "0",
              month: "0",
              day: "0",
              accessToken: GetAccessToken()
          })
            .$promise.then(function (data) {
                $scope.photoCount = data.count;
                if (data.count == 0)
                    $scope.photoStatus = "No Auto Backup photos found.";
                else
                    ImportAlbumPhotos(albumId)
                    //DeletePhotos(albumId);
            });
      };

      //function DeletePhotos(albumId) {
      //    $scope.photoStatus = "Deleting photos...";
      //    DeletePhotosResource.Delete()
      //      .$promise.then(function () {
      //          ImportAlbumPhotos(albumId);
      //      });
      //};

      function ImportAlbumPhotos(albumId) {
          $scope.photoStatus = "Importing Photos...";
          $scope.photoProgress = 0;
          var totalCount = $scope.photoCount;
          var size = 1000;
          var i = 0;
          for (i = 1; i < totalCount; i += size) {
              ImportPhotoResource.ImportPhotos({
                  albumId: albumId,
                  startIndex: i,
                  maxResults: size,
                  accessToken: GetAccessToken()
              })
              .$promise.then(function (photosImported) {
                  $scope.photoProgress += photosImported.count;
                  if ($scope.photoProgress == totalCount)
                      $scope.photoStatus = "Done";
              });
          }
      };
});

Controllers.controller('ToolsCtrl',
    function ($scope, $routeParams,
        ImportPhotoResource, AuthenticateResource) {

        //****************************************
        // AUTHENTICATE
        //****************************************

        $scope.needSignIn = false;
        Authenticate();

        function Authenticate() {
            AuthenticateResource(GetAccessToken(), GetRefreshToken()).Get()
            .$promise.then(function (data) {
                StoreValues(data);
            }, function (error) {
                $scope.needSignIn = true;
            });
        }

        function StoreValues(data) {
            localStorage.setItem("google_access_token", data.access_token);
            localStorage.setItem("google_user_id", data.user_id);
            localStorage.setItem("google_expires_in", data.expires_in);
            //Initialize();
        }

        function GetAccessToken() {
            return localStorage.getItem("google_access_token");
        }

        function GetRefreshToken() {
            return localStorage.getItem("google_refresh_token");
        }

        //*********************************************
        // Import
        //*********************************************

        $scope.ImportPhotos = function () {
            SetAlert('warning', 'Importing photos...');
            ImportPhotoResource(GetAccessToken(), GetRefreshToken()).Post({
                job: 'false'
            }).$promise.then(function (data) {
                if (data.success) {
                    SetAlert('success', "Photo import successful.");
                } else
                    SetAlert('danger', "Photo import failed.");
            });
        }

        $scope.closeAlert = function (index) {
            $scope.alerts.splice(index, 1);
        };

        function SetAlert(type, msg) {
            $scope.alerts = [{ type: type, msg: msg }];
        }
});

Controllers.controller('AlbumsCtrl',
    function ($scope, $routeParams,
        ImportAlbumResource, SearchAlbumsResource,
        SearchResource, AuthenticateResource) {

        //****************************************
        // AUTHENTICATE
        //****************************************

        $scope.needSignIn = false;
        Authenticate();

        function Authenticate() {
            AuthenticateResource(GetAccessToken(), GetRefreshToken()).Get()
            .$promise.then(function (data) {
                StoreValues(data);
            }, function (error) {
                $scope.needSignIn = true;
            });
        }

        function StoreValues(data) {
            localStorage.setItem("google_access_token", data.access_token);
            localStorage.setItem("google_user_id", data.user_id);
            localStorage.setItem("google_expires_in", data.expires_in);
            Initialize();
        }

        function GetAccessToken() {
            return localStorage.getItem("google_access_token");
        }

        function GetRefreshToken() {
            return localStorage.getItem("google_refresh_token");
        }

        //****************************************
        // INITIALIZE
        //****************************************

        function Initialize() {

            var query = $routeParams.query;
            if (query != undefined && query.length > 0)
                $scope.search = query;
            else {
                if (localStorage.getItem("album_search") == undefined)
                    $scope.search = "";
                else
                    $scope.search = localStorage.getItem("album_search");
            }

            if (localStorage.getItem("album_order") == undefined)
                $scope.order = "date";
            else
                $scope.order = localStorage.getItem("album_order");

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
            localStorage.setItem("album_search", $scope.search);
            localStorage.setItem("album_order", $scope.order);

            var query = $scope.search;
            SearchAlbumsResource.Get({
                query: query,
                order: GetOrder(),
                accessToken: GetAccessToken()
            }).$promise.then(function (data) {
                $scope.items = data.list;
                if (query != "") {
                    if (data.list.length > 0)
                        InsertSearch(query);
                    else
                        DeleteSearch(query);
                }
            });
        }

        function GetOrder() {
            if ($scope.order == "") {
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
            switch (value) {

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
            SetAlert('warning', 'Importing albums...');

            ImportAlbumResource(GetAccessToken(), GetRefreshToken()).Post()
            .$promise.then(function (data) {
                //$scope.response = data.message;
                if (data.success) {
                    SetAlert('success', 'Album import successful.');
                    Search();
                } else
                    SetAlert('danger', 'Album import failed');
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
            return SearchResource(GetAccessToken()).Get({
                query: '^' + val,
                type: "album"
            }).$promise.then(function (data) {
                return data;
            });
        }

        function InsertSearch(query) {
            SearchResource(GetAccessToken()).Post({
                query: query,
                type: "album"
            });
        }

        function DeleteSearch(query) {
            SearchResource(GetAccessToken()).Delete({
                query: query,
                type: "album"
            });
        }

    });

Controllers.controller('AlbumTypesCtrl',
  function ($scope, AlbumTypesResource, AuthenticateResource, ProfileResource) {

      //****************************************
      // AUTHENTICATE
      //****************************************

      $scope.needSignIn = false;
      Authenticate();

      function Authenticate() {
          AuthenticateResource(GetAccessToken(), GetRefreshToken()).Get()
          .$promise.then(function (data) {
              StoreValues(data);
          }, function (error) {
              $scope.needSignIn = true;
          });
      }

      function StoreValues(data) {
          localStorage.setItem("google_access_token", data.access_token);
          localStorage.setItem("google_user_id", data.user_id);
          localStorage.setItem("google_expires_in", data.expires_in);
          Initialize();
      }

      function GetAccessToken() {
          return localStorage.getItem("google_access_token");
      }

      function GetRefreshToken() {
          return localStorage.getItem("google_refresh_token");
      }

      //****************************************
      // INITIALIZE
      //****************************************

      function Initialize() {
          $scope.albums = AlbumTypesResource.GetAlbumTypes({
              accessToken: GetAccessToken()
          });
      }
  });

Controllers.controller('AlbumsYearCtrl',
  function ($scope, $routeParams, AlbumsYearResource, AuthenticateResource) {

      //****************************************
      // AUTHENTICATE
      //****************************************

      $scope.needSignIn = false;
      Authenticate();

      function Authenticate() {
          AuthenticateResource(GetAccessToken(), GetRefreshToken()).Get()
          .$promise.then(function (data) {
              StoreValues(data);
          }, function (error) {
              $scope.needSignIn = true;
          });
      }

      function StoreValues(data) {
          localStorage.setItem("google_access_token", data.access_token);
          localStorage.setItem("google_user_id", data.user_id);
          localStorage.setItem("google_expires_in", data.expires_in);
          Initialize();
      }

      function GetAccessToken() {
          return localStorage.getItem("google_access_token");
      }

      function GetRefreshToken() {
          return localStorage.getItem("google_refresh_token");
      }

      //****************************************
      // INITIALIZE
      //****************************************

      function Initialize() {
          var type = $routeParams.type;
          if (type == "auto-backup")
              $scope.title = "Auto Backup";
          else if (type == "upload")
              $scope.title = "Upload";
          else if (type == "date")
              $scope.title = "Date Albums";
          else
              $scope.title = "Other Albums";

          $scope.type = type;
          $scope.albums = AlbumsYearResource.GetAlbums({
              type: $routeParams.type,
              accessToken: GetAccessToken()
          });
      }
  });

Controllers.controller('AlbumsMonthCtrl',
  function ($scope, $routeParams, AlbumsMonthResource, AuthenticateResource) {

      //****************************************
      // AUTHENTICATE
      //****************************************

      $scope.needSignIn = false;
      Authenticate();

      function Authenticate() {
          AuthenticateResource(GetAccessToken(), GetRefreshToken()).Get()
          .$promise.then(function (data) {
              StoreValues(data);
          }, function (error) {
              $scope.needSignIn = true;
          });
      }

      function StoreValues(data) {
          localStorage.setItem("google_access_token", data.access_token);
          localStorage.setItem("google_user_id", data.user_id);
          localStorage.setItem("google_expires_in", data.expires_in);
          Initialize();
      }

      function GetAccessToken() {
          return localStorage.getItem("google_access_token");
      }

      function GetRefreshToken() {
          return localStorage.getItem("google_refresh_token");
      }

      //****************************************
      // INITIALIZE
      //****************************************

      function Initialize() {
          $scope.type = $routeParams.type;
          $scope.year = $routeParams.year;
          $scope.albums = AlbumsMonthResource.GetAlbums({
              type: $routeParams.type,
              year: $routeParams.year,
              accessToken: GetAccessToken()
          });
      }
  });

Controllers.controller('AlbumsDayCtrl',
  function ($scope, $routeParams, AlbumsDayResource, AuthenticateResource) {

      //****************************************
      // AUTHENTICATE
      //****************************************

      $scope.needSignIn = false;
      Authenticate();

      function Authenticate() {
          AuthenticateResource(GetAccessToken(), GetRefreshToken()).Get()
          .$promise.then(function (data) {
              StoreValues(data);
          }, function (error) {
              $scope.needSignIn = true;
          });
      }

      function StoreValues(data) {
          localStorage.setItem("google_access_token", data.access_token);
          localStorage.setItem("google_user_id", data.user_id);
          localStorage.setItem("google_expires_in", data.expires_in);
          Initialize();
      }

      function GetAccessToken() {
          return localStorage.getItem("google_access_token");
      }

      function GetRefreshToken() {
          return localStorage.getItem("google_refresh_token");
      }

      //****************************************
      // INITIALIZE
      //****************************************

      function Initialize() {
          $scope.type = $routeParams.type;
          $scope.year = $routeParams.year;
          $scope.month = $routeParams.month;
          $scope.albums = AlbumsDayResource.GetAlbums({
              type: $routeParams.type,
              year: $routeParams.year,
              month: $routeParams.month,
              accessToken: GetAccessToken()
          });
      }
  });

Controllers.controller('AlbumsOtherCtrl',
  function ($scope, $routeParams, AlbumsResource, AuthenticateResource) {

      //****************************************
      // AUTHENTICATE
      //****************************************

      $scope.needSignIn = false;
      Authenticate();

      function Authenticate() {
          AuthenticateResource(GetAccessToken(), GetRefreshToken()).Get()
          .$promise.then(function (data) {
              StoreValues(data);
          }, function (error) {
              $scope.needSignIn = true;
          });
      }

      function StoreValues(data) {
          localStorage.setItem("google_access_token", data.access_token);
          localStorage.setItem("google_user_id", data.user_id);
          localStorage.setItem("google_expires_in", data.expires_in);
          Initialize();
      }

      function GetAccessToken() {
          return localStorage.getItem("google_access_token");
      }

      function GetRefreshToken() {
          return localStorage.getItem("google_refresh_token");
      }

      //****************************************
      // INITIALIZE
      //****************************************

      function Initialize() {
          $scope.type = $routeParams.type;
          $scope.albums = AlbumsResource.GetAlbums({
              type: $routeParams.type,
              accessToken: GetAccessToken()
          });
      }
  });

Controllers.controller('AlbumsMaintCtrl',
  function ($scope, $routeParams, AlbumsResource, MergeAlbumsResource, AuthenticateResource) {

      //****************************************
      // AUTHENTICATE
      //****************************************

      $scope.needSignIn = false;
      Authenticate();

      function Authenticate() {
          AuthenticateResource(GetAccessToken(), GetRefreshToken()).Get()
          .$promise.then(function (data) {
              StoreValues(data);
          }, function (error) {
              $scope.needSignIn = true;
          });
      }

      function StoreValues(data) {
          localStorage.setItem("google_access_token", data.access_token);
          localStorage.setItem("google_user_id", data.user_id);
          localStorage.setItem("google_expires_in", data.expires_in);
          Initialize();
      }

      function GetAccessToken() {
          return localStorage.getItem("google_access_token");
      }

      function GetRefreshToken() {
          return localStorage.getItem("google_refresh_token");
      }

      //****************************************
      // INITIALIZE
      //****************************************

      function Initialize() {
          $scope.albums = AlbumsResource.GetAlbums({
              type: 'auto-backup',
              accessToken: GetAccessToken()
          });
      }

      $scope.refresh = function () {
          $scope.status = "";
          $scope.albums = AlbumsResource.GetAlbums({
              type: 'auto-backup',
              accessToken: GetAccessToken()
          });
      };

      $scope.select = function (album) {
          if (album.Selected == 0)
              album.Selected = 1;
          else
              album.Selected = 0;
      };

      $scope.merge = function () {
          var jsonArray = [];
          var jsonObject = {};
          var i = 0;
          for (i = 0; i < $scope.albums.list.length; i++) {
              if ($scope.albums.list[i].Selected == 1) {
                  jsonArray.push({ "id": $scope.albums.list[i].Id, "numPhotos": $scope.albums.list[i].NumPhotos });
              }
          }
          for (i = $scope.albums.list.length - 1; i >= 0; i--) {
              if ($scope.albums.list[i].Selected == 1) {
                  $scope.albums.list.splice(i, 1);
              }
          }
          jsonObject.ids = jsonArray;
          jsonObject.accessToken = GetAccessToken();
          $scope.status = MergeAlbumsResource.Merge(jsonObject);
      };
  });

Controllers.controller('AlbumPhotosCtrl',
  function ($scope, $routeParams, PicasaAlbumFeedResource, AuthenticateResource) {

      //****************************************
      // AUTHENTICATE
      //****************************************

      $scope.needSignIn = false;
      Authenticate();

      function Authenticate() {
          AuthenticateResource(GetAccessToken(), GetRefreshToken()).Get()
          .$promise.then(function (data) {
              StoreValues(data);
          }, function (error) {
              $scope.needSignIn = true;
          });
      }

      function StoreValues(data) {
          localStorage.setItem("google_access_token", data.access_token);
          localStorage.setItem("google_user_id", data.user_id);
          localStorage.setItem("google_expires_in", data.expires_in);
          Initialize();
      }

      function GetAccessToken() {
          return localStorage.getItem("google_access_token");
      }

      function GetRefreshToken() {
          return localStorage.getItem("google_refresh_token");
      }

      //****************************************
      // INITIALIZE
      //****************************************

      function Initialize() {
          $scope.startIndex = 1;
          $scope.maxResults = 77;
          $scope.albumId = $routeParams.albumId;

          $scope.list = PicasaAlbumFeedResource($routeParams.albumId, GetAccessToken()).Get({
              'kind': 'photo',
              'start-index': $scope.startIndex,
              'max-results': $scope.maxResults,
              'alt': 'json'
          });
      }

      $scope.StoreId = function (photoId) {
          localStorage.setItem('fotoId', photoId);
      }
  });

Controllers.controller('AlbumPhotosDateCtrl',
  function ($scope, $routeParams, AlbumPhotoListResource, AlbumPhotoCountResource, AuthenticateResource) {

      //****************************************
      // AUTHENTICATE
      //****************************************

      $scope.needSignIn = false;
      Authenticate();

      function Authenticate() {
          AuthenticateResource(GetAccessToken(), GetRefreshToken()).Get()
          .$promise.then(function (data) {
              StoreValues(data);
          }, function (error) {
              $scope.needSignIn = true;
          });
      }

      function StoreValues(data) {
          localStorage.setItem("google_access_token", data.access_token);
          localStorage.setItem("google_user_id", data.user_id);
          localStorage.setItem("google_expires_in", data.expires_in);
          Initialize();
      }

      function GetAccessToken() {
          return localStorage.getItem("google_access_token");
      }

      function GetRefreshToken() {
          return localStorage.getItem("google_refresh_token");
      }

      //****************************************
      // INITIALIZE
      //****************************************

      function Initialize() {
          $scope.visible = "hidden";
          $scope.type = $routeParams.type;
          $scope.year = $routeParams.year;
          $scope.month = $routeParams.month;
          $scope.day = $routeParams.day;
          $scope.albumId = $routeParams.albumId;
          $scope.startIndex = $routeParams.startIndex;
          $scope.maxResults = $routeParams.maxResults;

          $scope.currentPage = Math.ceil($scope.startIndex / $scope.maxResults);

          if ($scope.type != "other")
              $scope.title = $scope.year + "-" + $scope.month + "-" + $scope.day;
          else
              $scope.title = "Photos";

          AlbumPhotoCountResource.GetAlbumPhotoCount({
              albumId: $routeParams.albumId,
              type: $routeParams.type,
              year: $routeParams.year,
              month: $routeParams.month,
              day: $routeParams.day,
              accessToken: GetAccessToken()
          })
          .$promise.then(function (data) {
              var count = data.count;
              $scope.count = count;
              $scope.numPages = Math.ceil(parseInt(count) / parseInt($scope.maxResults));
              $scope.next = ($scope.currentPage == $scope.numPages) ? $scope.startIndex : (parseInt($scope.startIndex) + parseInt($scope.maxResults));
              $scope.upper = parseInt($scope.startIndex) + parseInt($scope.maxResults) - 1;
              if (parseInt($scope.upper) > parseInt(count))
                  $scope.upper = count;
              $scope.visible = "visible";
          });

          $scope.photos = AlbumPhotoListResource.GetAlbumPhotos({
              albumId: $routeParams.albumId,
              startIndex: $routeParams.startIndex,
              maxResults: $routeParams.maxResults,
              index: $routeParams.index,
              type: $routeParams.type,
              year: $routeParams.year,
              month: $routeParams.month,
              day: $routeParams.day,
              accessToken: GetAccessToken()
          });
      }
  });

Controllers.controller('DupAlbumsCtrl',
  function ($scope, DupAlbumsResource, MergeDupAlbumResource, AuthenticateResource) {

      //****************************************
      // AUTHENTICATE
      //****************************************

      $scope.needSignIn = false;
      Authenticate();

      function Authenticate() {
          AuthenticateResource(GetAccessToken(), GetRefreshToken()).Get()
          .$promise.then(function (data) {
              StoreValues(data);
          }, function (error) {
              $scope.needSignIn = true;
          });
      }

      function StoreValues(data) {
          localStorage.setItem("google_access_token", data.access_token);
          localStorage.setItem("google_user_id", data.user_id);
          localStorage.setItem("google_expires_in", data.expires_in);
          Initialize();
      }

      function GetAccessToken() {
          return localStorage.getItem("google_access_token");
      }

      function GetRefreshToken() {
          return localStorage.getItem("google_refresh_token");
      }

      //****************************************
      // INITIALIZE
      //****************************************

      function Initialize() {
          $scope.albums = DupAlbumsResource.GetDupAlbums({
              accessToken: GetAccessToken()
          });
      }

      $scope.merge = function (selectedRow) {
          var index = $scope.albums.dups.indexOf(selectedRow);
          $scope.albums.dups.splice(index, 1);
          selectedRow.accessToken = GetAccessToken();
          MergeDupAlbumResource.MergeDupAlbums(selectedRow);
      };
  });

Controllers.controller('CreateAlbumCtrl',
  function ($scope, CreateAlbumResource, AuthenticateResource) {

      //****************************************
      // AUTHENTICATE
      //****************************************

      $scope.needSignIn = false;
      Authenticate();

      function Authenticate() {
          AuthenticateResource(GetAccessToken(), GetRefreshToken()).Get()
          .$promise.then(function (data) {
              StoreValues(data);
          }, function (error) {
              $scope.needSignIn = true;
          });
      }

      function StoreValues(data) {
          localStorage.setItem("google_access_token", data.access_token);
          localStorage.setItem("google_user_id", data.user_id);
          localStorage.setItem("google_expires_in", data.expires_in);
          Initialize();
      }

      function GetAccessToken() {
          return localStorage.getItem("google_access_token");
      }

      function GetRefreshToken() {
          return localStorage.getItem("google_refresh_token");
      }

      //****************************************
      // INITIALIZE
      //****************************************

      function Initialize() {

      }

      $scope.reset = function () {
          $scope.item = undefined;
      };
      $scope.save = function () {
          $scope.item.accessToken = GetAccessToken();
          CreateAlbumResource.Save($scope.item);
      };
  });

Controllers.controller('UpdateAlbumCtrl',
  function ($scope, $routeParams, AlbumResource, UpdateAlbumResource,
      AuthenticateResource) {

      //****************************************
      // AUTHENTICATE
      //****************************************

      $scope.needSignIn = false;
      Authenticate();

      function Authenticate() {
          AuthenticateResource(GetAccessToken(), GetRefreshToken()).Get()
          .$promise.then(function (data) {
              StoreValues(data);
          }, function (error) {
              $scope.needSignIn = true;
          });
      }

      function StoreValues(data) {
          localStorage.setItem("google_access_token", data.access_token);
          localStorage.setItem("google_user_id", data.user_id);
          localStorage.setItem("google_expires_in", data.expires_in);
          Initialize();
      }

      function GetAccessToken() {
          return localStorage.getItem("google_access_token");
      }

      function GetRefreshToken() {
          return localStorage.getItem("google_refresh_token");
      }

      //****************************************
      // INITIALIZE
      //****************************************

      function Initialize() {
          AlbumResource.Get({
              albumId: $routeParams.albumId,
              accessToken: GetAccessToken()
          }).$promise.then(function (data) {
              $scope.item = data.entry;
          });
      }

      $scope.reset = function () {
          $scope.item = undefined;
      };

      $scope.save = function () {
          $scope.item.accessToken = GetAccessToken();
          UpdateAlbumResource.Save($scope.item);
      };
  });

Controllers.controller('UpdatePhotoCtrl',
  function ($scope, $routeParams, PicasaPhotoResource, UpdatePhotoResource,
      SearchResource, AuthenticateResource) {

      //****************************************
      // AUTHENTICATE
      //****************************************

      $scope.needSignIn = false;
      Authenticate();

      function Authenticate() {
          AuthenticateResource(GetAccessToken(), GetRefreshToken()).Get()
          .$promise.then(function (data) {
              StoreValues(data);
          }, function (error) {
              $scope.needSignIn = true;
          });
      }

      function StoreValues(data) {
          localStorage.setItem("google_access_token", data.access_token);
          localStorage.setItem("google_user_id", data.user_id);
          localStorage.setItem("google_expires_in", data.expires_in);
          Initialize();
      }

      function GetAccessToken() {
          return localStorage.getItem("google_access_token");
      }

      function GetRefreshToken() {
          return localStorage.getItem("google_refresh_token");
      }

      //****************************************
      // INITIALIZE
      //****************************************

      function Initialize() {
          $scope.tags = [];

          PicasaPhotoResource($routeParams.photoId, GetAccessToken()).Get({
              'alt': 'json'
          }).$promise.then(function (data) {
              $scope.item = data.entry;
              $scope.tags = data.entry.media$group.media$keywords.$t.split(',');
          });
      }

      $scope.reset = function () {
          $scope.item = undefined;
      };

      $scope.save = function () {
          Save();
      };

      function Save() {
          $scope.item.accessToken = GetAccessToken();
          UpdatePhotoResource.Save($scope.item);
      }

      $scope.GetSearchList = function (val) {
          return SearchResource(GetAccessToken()).Get({
              query: '^' + val,
              type: 'photo'
          }).$promise.then(function (data) {
              return data;
          });
      }

      function InsertSearch() {
          var query = $scope.tag;
          if (query != undefined && query != "")
              SearchResource(GetAccessToken).Insert({
                  query: query,
                  type: 'photo'
              });
      }

      $scope.AddTag = function () {
          AddTag();
      }

      $scope.GoAddTag = function ($event) {
          var keypressed = $event.keyCode || $event.which;
          if (keypressed == 13 || keypressed == 9)
              AddTag();
      }

      function AddTag() {

          if ($scope.tags.indexOf($scope.tag) == -1) {
              $scope.tags.push($scope.tag);
              InsertSearch();
              $scope.tag = "";
          }
      }

      $scope.RemoveTag = function (item) {
          var index = $scope.tags.indexOf(item);
          $scope.tags.splice(index, 1);
      }

      $scope.$watchCollection('tags', function (value) {
          if (value != undefined && $scope.item != undefined) {
              $scope.item.media$group.media$keywords.$t = value.toString();
              Save();
          }
      });
  });

Controllers.controller('DeleteAlbumCtrl',
  function ($scope, $routeParams, DeleteAlbumConfirmResource, AuthenticateResource) {

      //****************************************
      // AUTHENTICATE
      //****************************************

      $scope.needSignIn = false;
      Authenticate();

      function Authenticate() {
          AuthenticateResource(GetAccessToken(), GetRefreshToken()).Get()
          .$promise.then(function (data) {
              StoreValues(data);
          }, function (error) {
              $scope.needSignIn = true;
          });
      }

      function StoreValues(data) {
          localStorage.setItem("google_access_token", data.access_token);
          localStorage.setItem("google_user_id", data.user_id);
          localStorage.setItem("google_expires_in", data.expires_in);
          Initialize();
      }

      function GetAccessToken() {
          return localStorage.getItem("google_access_token");
      }

      function GetRefreshToken() {
          return localStorage.getItem("google_refresh_token");
      }

      //****************************************
      // INITIALIZE
      //****************************************

      function Initialize() {

      }

      $scope.delete = function () {
          DeleteAlbumConfirmResource.Delete({
              albumId: $routeParams.albumId,
              accessToken: GetAccessToken()
          });
      };
  });

Controllers.controller('ViewerAlbumCtrl',
  function ($scope, $routeParams, $modal, $log, AlbumPhotoListResource, DeletePhotoResource, UpdatePhotoPartialResource, AuthenticateResource) {

      //****************************************
      // AUTHENTICATE
      //****************************************

      $scope.needSignIn = false;
      Authenticate();

      function Authenticate() {
          AuthenticateResource(GetAccessToken(), GetRefreshToken()).Get()
          .$promise.then(function (data) {
              StoreValues(data);
          }, function (error) {
              $scope.needSignIn = true;
          });
      }

      function StoreValues(data) {
          localStorage.setItem("google_access_token", data.access_token);
          localStorage.setItem("google_user_id", data.user_id);
          localStorage.setItem("google_expires_in", data.expires_in);
          Initialize();
      }

      function GetAccessToken() {
          return localStorage.getItem("google_access_token");
      }

      function GetRefreshToken() {
          return localStorage.getItem("google_refresh_token");
      }

      //****************************************
      // INITIALIZE
      //****************************************

      function Initialize() {
          $scope.myInterval = -1;

          if ($routeParams.albumId != undefined)
              $scope.photos = AlbumPhotoListResource.GetAlbumPhotos({
                  albumId: $routeParams.albumId,
                  startIndex: $routeParams.startIndex,
                  maxResults: $routeParams.maxResults,
                  index: $routeParams.index,
                  type: $routeParams.type,
                  year: $routeParams.year,
                  month: $routeParams.month,
                  day: $routeParams.day,
                  accessToken: GetAccessToken()
              });
      }

      $scope.Delete = function (photoItem) {
          var index = $scope.photos.list.indexOf(photoItem);
          $scope.photos.list.splice(index, 1);
          if ($scope.photos.list.length > 0)
            $scope.photos.list[0].active = true;
          DeletePhotoResource.Delete({
              photoId: photoItem.Id,
              albumId: $routeParams.albumId,
              accessToken: GetAccessToken()
          });
      };

      $scope.Rotate = function (photoItem, value) {
          var keywords = "";
          var index = $scope.photos.list.indexOf(photoItem);

          if (photoItem.Keywords == "")
              if (value == 90)
                  keywords = "rotate-right-90";
              else
                  keywords = "rotate-left-90";

          else if (photoItem.Keywords == "rotate-right-90")
              if (value == 90)
                  keywords = "rotate-right-180";
              else
                  keywords = "";

          else if (photoItem.Keywords == "rotate-left-90")
              if (value == 90)
                  keywords = "";
              else
                  keywords = "rotate-left-180";

          else if (photoItem.Keywords.indexOf("180") > 0)
              if (value == 90)
                  keywords = "rotate-right-270";
              else
                  keywords = "rotate-left-270";

          $scope.photos.list[index].Keywords = keywords;
          UpdatePhotoPartialResource.Update({
              photoId: photoItem.Id,
              type: "rotation",
              value: value,
              accessToken: GetAccessToken()
          });
      };

      $scope.Tag = function (photoId) {

      };

      $scope.Share = function (photoId) {

      };

      $scope.Slideshow = function (photoItem) {
          if ($scope.myInterval == -1) {
              $scope.myInterval = 5000;
              var index = $scope.photos.list.indexOf(photoItem);
              if (index == $scope.photos.list.length - 1)
                  $scope.photos.list[0].active = true;
              else
                  $scope.photos.list[index + 1].active = true;
          }
          else
              $scope.myInterval = -1;
      };

      $scope.items = ['item1', 'item2', 'item3'];

      $scope.open = function (size, photoId) {

          var modalInstance = $modal.open({
              templateUrl: 'views/modal-tag.html',
              controller: 'ModalInstanceCtrl',
              size: size,
              resolve: {
                  items: function () {
                      return $scope.items;
                  },
                  photoId: function () {
                      return photoId;
                  }
              }
          });

          modalInstance.result.then(function (selectedItem) {
              $scope.selected = selectedItem;
          }, function () {
              $log.info('Modal dismissed at: ' + new Date());
          });
      };
  });

Controllers.controller('ViewerPhotoCtrl',
  function ($scope, $routeParams, $modal, $log, $sce, PicasaPhotoResource, DeletePhotoResource, UpdatePhotoPartialResource, AuthenticateResource) {

      //****************************************
      // AUTHENTICATE
      //****************************************

      $scope.needSignIn = false;
      Authenticate();

      function Authenticate() {
          AuthenticateResource(GetAccessToken(), GetRefreshToken()).Get()
          .$promise.then(function (data) {
              StoreValues(data);
          }, function (error) {
              $scope.needSignIn = true;
          });
      }

      function StoreValues(data) {
          localStorage.setItem("google_access_token", data.access_token);
          localStorage.setItem("google_user_id", data.user_id);
          localStorage.setItem("google_expires_in", data.expires_in);
          Initialize();
      }

      function GetAccessToken() {
          return localStorage.getItem("google_access_token");
      }

      function GetRefreshToken() {
          return localStorage.getItem("google_refresh_token");
      }

      //****************************************
      // INITIALIZE
      //****************************************

      function Initialize() {

          PicasaPhotoResource($routeParams.photoId, GetAccessToken()).Get({
              'alt': 'json'
          }).$promise.then(function (data) {
              $scope.photo = data.entry;
              $scope.size = '800';

              var resource = data.entry.media$group.media$content[1];
              if (resource != undefined)
                  $scope.videoUrl = $sce.trustAsResourceUrl(data.entry.media$group.media$content[1].url);
          });
      }

      $scope.$watch('size', function (value) {
          if ($scope.photo != undefined) {
              $scope.photoUrl = $scope.photo.media$group.media$thumbnail[0].url.replace('72', value);
          }
      });

      $scope.Delete = function () {
          DeletePhotoResource.Delete({
              photoId: $scope.photo.gphoto$id.$t,
              albumId: $scope.photo.gphoto$albumid.$t,
              accessToken: GetAccessToken()
          });
      };

      $scope.Rotate = function (value) {
          var position = "";

          if ($scope.photo.position == undefined || $scope.photo.position == "")
              if (value == 90)
                  position = "rotate-right-90";
              else
                  position = "rotate-left-90";

          else if ($scope.photo.position == "rotate-right-90")
              if (value == 90)
                  position = "rotate-right-180";
              else
                  position = "";

          else if ($scope.photo.position == "rotate-left-90")
              if (value == 90)
                  position = "";
              else
                  position = "rotate-left-180";

          else if ($scope.photo.position.indexOf("180") > 0)
              if (value == 90)
                  position = "rotate-right-270";
              else
                  position = "rotate-left-270";

          $scope.photo.position = position;
          UpdatePhotoPartialResource.Update({
              photoId: $scope.photo.gphoto$id.$t,
              type: "rotation",
              value: value,
              accessToken: GetAccessToken()
          });
      };

      $scope.Tag = function (photoId) {

      };

      $scope.Share = function (photoId) {

      };

      //photo.media$group.media$thumbnail[0].url | enlarge

      $scope.items = ['item1', 'item2', 'item3'];

      $scope.open = function (size, photoId) {

          var modalInstance = $modal.open({
              templateUrl: 'views/modal-tag.html',
              controller: 'ModalInstanceCtrl',
              size: size,
              resolve: {
                  items: function () {
                      return $scope.items;
                  },
                  photoId: function () {
                      return photoId;
                  }
              }
          });

          modalInstance.result.then(function (selectedItem) {
              $scope.selected = selectedItem;
          }, function () {
              $log.info('Modal dismissed at: ' + new Date());
          });
      };

  });

Controllers.controller('ViewerPhotosCtrl',
  function ($scope, $routeParams, $modal, $log, PicasaResource, PicasaPhotoResource, DeletePhotoResource, UpdatePhotoPartialResource, AuthenticateResource) {

      //****************************************
      // AUTHENTICATE
      //****************************************

      $scope.needSignIn = false;
      Authenticate();

      function Authenticate() {
          AuthenticateResource(GetAccessToken(), GetRefreshToken()).Get()
          .$promise.then(function (data) {
              StoreValues(data);
          }, function (error) {
              $scope.needSignIn = true;
          });
      }

      function StoreValues(data) {
          localStorage.setItem("google_access_token", data.access_token);
          localStorage.setItem("google_user_id", data.user_id);
          localStorage.setItem("google_expires_in", data.expires_in);
          Initialize();
      }

      function GetAccessToken() {
          return localStorage.getItem("google_access_token");
      }

      function GetRefreshToken() {
          return localStorage.getItem("google_refresh_token");
      }

      //****************************************
      // INITIALIZE
      //****************************************

      function Initialize() {
          $scope.myInterval = -1;
          GetPhoto();
      }

      function GetPhoto() {
          PicasaPhotoResource(localStorage.getItem('fotoId'), GetAccessToken()).Get({
              'alt': 'json'
          }).$promise.then(function (data) {
              $scope.photo = data.entry;
              GetPhotos();
          });
      }

      function GetPhotos() {
          PicasaResource(GetAccessToken()).Get({
              'kind': 'photo',
              'q': $routeParams.tag,
              'start-index': $routeParams.startIndex,
              'max-results': $routeParams.maxResults,
              'alt': 'json'
          }).$promise.then(function (data) {
              $scope.list = data;
              SetActive();
          });
      }

      function SetActive() {
          //var index = $scope.list.feed.entry.indexOf($scope.photo);
          var index = GetIndex();
          $scope.list.feed.entry[index].active = true;
      }

      function GetIndex() {
          var i = 0;
          for (i = 0; i < $scope.list.feed.entry.length; i++) {
              if ($scope.list.feed.entry[i].gphoto$id.$t == localStorage.getItem('fotoId'))
                  return i;
          }

          // not found in list, so add to list
          $scope.list.feed.entry.splice(0, 1, $scope.photo);
          return 0;
      }

      //$scope.ShowVideo = function (photo) {
      //    var resource = photo.media$group.media$content[1];
      //    if (resource != undefined)
      //        $scope.url = $sce.trustAsResourceUrl(photo.media$group.media$content[1].url);

      //    $scope.showVid = true;
      //}

      $scope.StoreId = function (photoId) {
          localStorage.setItem('fotoId', photoId);
      }

      //$scope.Go = function (photo) {
      //    if (photo.gphoto$originalvideo != undefined) {
      //        localStorage.setItem('fotoId', photo.gphoto$id.$t);
      //        location.href = "/foto/#/video/viewer/" + photo.gphoto$id.$t;
      //    } else {
      //        localStorage.setItem('fotoId', photo.gphoto$id.$t);
      //        location.href = photo.media$group.media$thumbnail[0].url.replace('72', '1200');
      //    }

      //}

      $scope.Delete = function (photoItem) {
          var index = $scope.list.feed.entry.indexOf(photoItem);
          $scope.list.feed.entry.splice(index, 1);
          if ($scope.list.feed.entry.length > 0)
              $scope.list.feed.entry[0].active = true;
          DeletePhotoResource.Delete({
              photoId: photoItem.Id,
              albumId: $routeParams.albumId,
              accessToken: GetAccessToken()
          });
      };

      $scope.Rotate = function (photoItem, value) {
          var position = "";
          var index = $scope.list.feed.entry.indexOf(photoItem);

          if (photoItem.position == undefined || photoItem.position == "")
              if (value == 90)
                  position = "rotate-right-90";
              else
                  position = "rotate-left-90";

          else if (photoItem.position == "rotate-right-90")
              if (value == 90)
                  position = "rotate-right-180";
              else
                  position = "";

          else if (photoItem.position == "rotate-left-90")
              if (value == 90)
                  position = "";
              else
                  position = "rotate-left-180";

          else if (photoItem.position.indexOf("180") > 0)
              if (value == 90)
                  position = "rotate-right-270";
              else
                  position = "rotate-left-270";

          $scope.list.feed.entry[index].position = position;
          UpdatePhotoPartialResource.Update({
              photoId: photoItem.gphoto$id.$t,
              type: "rotation",
              value: value,
              accessToken: GetAccessToken()
          });
      };

      $scope.Tag = function (photoId) {

      };

      $scope.Share = function (photoId) {

      };

      $scope.Slideshow = function (photoItem) {
          if ($scope.myInterval == -1) {
              $scope.myInterval = 5000;
              var index = $scope.list.feed.entry.indexOf(photoItem);
              if (index == $scope.list.feed.entry.length - 1)
                  $scope.list.feed.entry[0].active = true;
              else
                  $scope.list.feed.entry[index + 1].active = true;
          }
          else
              $scope.myInterval = -1;
      };

      $scope.items = ['item1', 'item2', 'item3'];

      $scope.open = function (size, photoId) {

          var modalInstance = $modal.open({
              templateUrl: 'views/modal-tag.html',
              controller: 'ModalInstanceCtrl',
              size: size,
              resolve: {
                  items: function () {
                      return $scope.items;
                  },
                  photoId: function () {
                      return photoId;
                  }
              }
          });

          modalInstance.result.then(function (selectedItem) {
              $scope.selected = selectedItem;
          }, function () {
              $log.info('Modal dismissed at: ' + new Date());
          });
      };

  });

Controllers.controller('ViewerAlbumPhotosCtrl',
  function ($scope, $routeParams, $modal, $log, PicasaAlbumFeedResource, PicasaPhotoResource, DeletePhotoResource, UpdatePhotoPartialResource, AuthenticateResource) {

      //****************************************
      // AUTHENTICATE
      //****************************************

      $scope.needSignIn = false;
      Authenticate();

      function Authenticate() {
          AuthenticateResource(GetAccessToken(), GetRefreshToken()).Get()
          .$promise.then(function (data) {
              StoreValues(data);
          }, function (error) {
              $scope.needSignIn = true;
          });
      }

      function StoreValues(data) {
          localStorage.setItem("google_access_token", data.access_token);
          localStorage.setItem("google_user_id", data.user_id);
          localStorage.setItem("google_expires_in", data.expires_in);
          Initialize();
      }

      function GetAccessToken() {
          return localStorage.getItem("google_access_token");
      }

      function GetRefreshToken() {
          return localStorage.getItem("google_refresh_token");
      }

      //****************************************
      // INITIALIZE
      //****************************************

      function Initialize() {
          $scope.myInterval = -1;
          GetPhoto();
      }

      function GetPhoto() {
          PicasaPhotoResource(localStorage.getItem('fotoId'), GetAccessToken()).Get({
              'alt': 'json'
          }).$promise.then(function (data) {
              $scope.photo = data.entry;
              GetPhotos();
          });
      }

      function GetPhotos() {
        PicasaAlbumFeedResource($routeParams.albumId, GetAccessToken()).Get({
            'kind': 'photo',
            'start-index': $scope.startIndex,
            'max-results': $scope.maxResults,
            'alt': 'json'
          }).$promise.then(function (data) {
              $scope.list = data;
              SetActive();
          });
      }

      function SetActive() {
          //var index = $scope.list.feed.entry.indexOf($scope.photo);
          var index = GetIndex();
          $scope.list.feed.entry[index].active = true;
      }

      function GetIndex() {
          var i = 0;
          for (i = 0; i < $scope.list.feed.entry.length; i++) {
              if ($scope.list.feed.entry[i].gphoto$id.$t == localStorage.getItem('fotoId'))
                  return i;
          }

          // not found in list, so add to list
          $scope.list.feed.entry.splice(0, 1, $scope.photo);
          return 0;
      }

      //$scope.ShowVideo = function (photo) {
      //    var resource = photo.media$group.media$content[1];
      //    if (resource != undefined)
      //        $scope.url = $sce.trustAsResourceUrl(photo.media$group.media$content[1].url);

      //    $scope.showVid = true;
      //}

      $scope.StoreId = function (photoId) {
          localStorage.setItem('fotoId', photoId);
      }

      //$scope.Go = function (photo) {
      //    if (photo.gphoto$originalvideo != undefined) {
      //        localStorage.setItem('fotoId', photo.gphoto$id.$t);
      //        location.href = "/foto/#/video/viewer/" + photo.gphoto$id.$t;
      //    } else {
      //        localStorage.setItem('fotoId', photo.gphoto$id.$t);
      //        location.href = photo.media$group.media$thumbnail[0].url.replace('72', '1200');
      //    }

      //}

      $scope.Delete = function (photoItem) {
          var index = $scope.list.feed.entry.indexOf(photoItem);
          $scope.list.feed.entry.splice(index, 1);
          if ($scope.list.feed.entry.length > 0)
              $scope.list.feed.entry[0].active = true;
          DeletePhotoResource.Delete({
              photoId: photoItem.Id,
              albumId: $routeParams.albumId,
              accessToken: GetAccessToken()
          });
      };

      $scope.Rotate = function (photoItem, value) {
          var position = "";
          var index = $scope.list.feed.entry.indexOf(photoItem);

          if (photoItem.position == undefined || photoItem.position == "")
              if (value == 90)
                  position = "rotate-right-90";
              else
                  position = "rotate-left-90";

          else if (photoItem.position == "rotate-right-90")
              if (value == 90)
                  position = "rotate-right-180";
              else
                  position = "";

          else if (photoItem.position == "rotate-left-90")
              if (value == 90)
                  position = "";
              else
                  position = "rotate-left-180";

          else if (photoItem.position.indexOf("180") > 0)
              if (value == 90)
                  position = "rotate-right-270";
              else
                  position = "rotate-left-270";

          $scope.list.feed.entry[index].position = position;
          UpdatePhotoPartialResource.Update({
              photoId: photoItem.gphoto$id.$t,
              type: "rotation",
              value: value,
              accessToken: GetAccessToken()
          });
      };

      $scope.Tag = function (photoId) {

      };

      $scope.Share = function (photoId) {

      };

      $scope.Slideshow = function (photoItem) {
          if ($scope.myInterval == -1) {
              $scope.myInterval = 5000;
              var index = $scope.list.feed.entry.indexOf(photoItem);
              if (index == $scope.list.feed.entry.length - 1)
                  $scope.list.feed.entry[0].active = true;
              else
                  $scope.list.feed.entry[index + 1].active = true;
          }
          else
              $scope.myInterval = -1;
      };

      $scope.items = ['item1', 'item2', 'item3'];

      $scope.open = function (size, photoId) {

          var modalInstance = $modal.open({
              templateUrl: 'views/modal-tag.html',
              controller: 'ModalInstanceCtrl',
              size: size,
              resolve: {
                  items: function () {
                      return $scope.items;
                  },
                  photoId: function () {
                      return photoId;
                  }
              }
          });

          modalInstance.result.then(function (selectedItem) {
              $scope.selected = selectedItem;
          }, function () {
              $log.info('Modal dismissed at: ' + new Date());
          });
      };

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
            AuthenticateResource(GetAccessToken(), GetRefreshToken()).Get()
            .$promise.then(function (data) {
                StoreValues(data);
            }, function (error) {
                $scope.needSignIn = true;
            });
        }

        function StoreValues(data) {
            localStorage.setItem("google_access_token", data.access_token);
            localStorage.setItem("google_user_id", data.user_id);
            localStorage.setItem("google_expires_in", data.expires_in);
            Initialize();
        }

        function GetAccessToken() {
            return localStorage.getItem("google_access_token");
        }

        function GetRefreshToken() {
            return localStorage.getItem("google_refresh_token");
        }

        //****************************************
        // INITIALIZE
        //****************************************

        function Initialize() {

            $scope.search = "";

            $scope.heading = GetHeading();
            $scope.path = GetPath();

            if (localStorage.getItem("tag_search_picasa") == undefined)
                $scope.search = "";
            else
                $scope.search = localStorage.getItem("tag_search_picasa");

            $scope.items = SearchResource(GetAccessToken()).Get({
                type: GetType()
            });
        }

        $scope.StoreFilter = function () {
            localStorage.setItem("tag_search_picasa", $scope.search);
        }

        $scope.ClearFilter = function () {
            $scope.search = "";
            localStorage.setItem("tag_search_picasa", "");
        }

        $scope.Delete = function (item) {
            var index = $scope.items.indexOf(item);
            $scope.items.splice(index, 1);
            SearchResource(GetAccessToken()).Delete({
                query: item.query,
                type: GetType()
            });
        }

        function IsPhoto() {
            if ($routeParams.type == "photo")
                return true;
            else
                return false
        }

        function GetType() {
            if (IsPhoto())
                return "photo";
            else
                return "album";
        }

        function GetHeading() {
            if (IsPhoto())
                return "Photo Tags";
            else
                return "Album Tags";
        }

        function GetPath() {
            if (IsPhoto())
                return "photos";
            else
                return "albums";
        }
    });

Controllers.controller('ModalInstanceCtrl', function ($scope, $modalInstance, items, photoId) {

    $scope.items = items;
    $scope.selected = {
        item: $scope.items[0]
    };

    $scope.photoId = photoId;

    $scope.ok = function () {
        $modalInstance.close($scope.selected.item);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});
