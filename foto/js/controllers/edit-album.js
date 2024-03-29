//*****************************************************************************************************************
// Copyright 2014-2022 Lahuna. All rights reserved.
// You may not copy, reproduce, republish, disassemble, decompile, reverse engineer, post, broadcast, transmit, or
// make available to the public any content or code on this website without prior written permission from Lahuna.
//*****************************************************************************************************************

'use strict';

var ctl = angular.module('EditAlbumController', ['ResourceFactory', 'AuthenticateFactory']);

ctl.controller('EditAlbumCtrl',
  function ($scope, $routeParams, PicasaAlbumResource,
    PicasaPhotoResource, PicasaResource, SearchResource,
    AlbumDbResource, Auth, $route, $rootScope) {

  // Authenticate
  Auth.Authenticate('foto', function (result) {
    $rootScope.profile = result;
    $rootScope.showSignIn = !result;
    Initialize();
  });

  $rootScope.SignIn = function () {
    Auth.SignIn('foto');
  }

  $rootScope.SignOut = function () {
    Auth.SignOut('foto');
    $rootScope.profile = null;
    $rootScope.showSignIn = true;
    $route.reload();
  }

  function GetAccessToken() {
    return localStorage.getItem('google_access_token');
  }

  //****************************************
  // INITIALIZE
  //****************************************

  function Initialize() {
    $scope.tags = [];
    if ($routeParams.albumId) {
      $scope.albumId = $routeParams.albumId;
      GetAlbum($scope.albumId);
    } else {
      $scope.item =  {
        'title': {'$t': ''},
        'gphoto$access': {'$t': 'private'}
      };
    }
  }

  function GetAlbum(albumId) {
    PicasaAlbumResource(albumId).Get({
      'accessToken': GetAccessToken()
    }).$promise.then(function (data) {
      $scope.item = data.entry;
      //var keywords = data.entry.media$group.media$keywords;
      var keywords = data.entry.summary;
      if (keywords.$t) {
        $scope.tags = keywords.$t.split(',');
      }
    });

    AlbumDbResource.Get({
        albumId: albumId,
        maxdocs: '1',
        accessToken: GetAccessToken()
    }).$promise.then(function (album) {
      $scope.dbAlbum = album.list[0];
    });
  }

  //$scope.reset = function () {
    //$scope.item = null;
  //};

  $scope.cancel = function () {

  };

  $scope.save = function () {
    Save();
  };

  function Save() {
    SetAlert('warning', 'Saving...');

    var xml =
      "<entry xmlns=\'http://www.w3.org/2005/Atom\' " +
        "xmlns:media=\'http://search.yahoo.com/mrss/\' " +
        //"xmlns:gphoto=\'http://schemas.google.com/photos/2007\'>" +
        "xmlns:gphoto=\'http://schemas.google.com/photos/2007\' " +
        "xmlns:gml='http://www.opengis.net/gml\' " +
        "xmlns:georss=\'http://www.georss.org/georss\'>" +
        "<title>" + $scope.item.title.$t + "</title>" +
        //"<summary>" + $scope.item.summary.$t + "</summary>" +
        "<summary>" + $scope.tags.toString() + "</summary>" +
        //"<gphoto:location>" + $scope.item.gphoto$location.$t + "</gphoto:location>" +
        //"<georss:where><gml:Point><gml:pos>" + $scope.item.georss$where.gml$Point.gml$pos.$t + "</gml:pos></gml:Point></georss:where>" +
        "<gphoto:access>" + $scope.item.gphoto$access.$t + "</gphoto:access>" +
        //"<gphoto:timestamp>1152255600000</gphoto:timestamp>" +
        //"<media:group><media:keywords>italy, vacation</media:keywords></media:group>" +
        // Does not work "<media:group><media:keywords>" + $scope.tags.toString() + "</media:keywords></media:group>" +
        // Does not work "<media:group><media:description>" + $scope.item.media$group.media$description.$t + "</media:description></media:group>" +
        "<category scheme=\'http://schemas.google.com/g/2005#kind\' " +
        "term=\'http://schemas.google.com/photos/2007#album\'></category>" +
      "</entry>";

    if ($scope.albumId) {
      PicasaAlbumResource($scope.albumId).Patch({
        xml: xml,
        accessToken: GetAccessToken()
      }).$promise.then(function (data) {
        AlbumDbResource.Put(dbItem(data.entry))
        .$promise.then(function (data) {
          SetAlert('success', "Album updated.");
        });
      });
    } else {
      PicasaResource.Post({
        xml: xml,
        contentType: 'application/atom+xml',
        accessToken: GetAccessToken()
      }).$promise.then(function (data) {
        if (data.error) {
          SetAlert('danger', data.error);
        } else {
          var item = data.entry;
          $scope.albumId = item.gphoto$id.$t;
          AlbumDbResource.Post(dbItem(item))
          .$promise.then(function (data) {
            SetAlert('success', "Album created.");
          });
        }
      });
    }
  }

  function dbItem (item) {
    var dbItem = {
      _id: ($scope.dbAlbum ? $scope.dbAlbum._id : undefined),
      albumId: item.gphoto$id.$t,
      title: item.title.$t,
      numPhotos: item.gphoto$numphotos.$t,
      thumbnail: item.media$group.media$thumbnail[0].url,
      published: item.published.$t,
      updated: item.updated.$t,
      access: item.gphoto$access.$t,
      tags: $scope.tags.toString(),
      accessToken: GetAccessToken()
    };
    return dbItem;
  }

  $scope.GetSearchList = function (val) {
    return SearchResource.Get({
      query: '^' + val,
      type: 'album',
      accessToken: GetAccessToken()
    }).$promise.then(function (data) {
      return data;
    });
  }

  function InsertSearch() {
    var query = $scope.tag;
    if (query && query.length > 0)
      SearchResource.Post({
        query: query,
        type: 'album',
          accessToken: GetAccessToken()
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
    if ($scope.tag.length > 0 && $scope.tags.indexOf($scope.tag) == -1) {
      $scope.tags.push($scope.tag);
      InsertSearch();
      $scope.tag = '';
    }
  }

  $scope.RemoveTag = function (item) {
    var index = $scope.tags.indexOf(item);
    $scope.tags.splice(index, 1);
  }

  $scope.closeAlert = function (index) {
      $scope.alerts.splice(index, 1);
  };

  function SetAlert(type, msg) {
      $scope.alerts = [{ type: type, msg: msg }];
  }

  //$scope.$watchCollection('tags', function (value) {
    //if (value && $scope.item) {
      //$scope.item.media$group.media$keywords.$t = value.toString();
      //Save();
    //}
  //});
});
