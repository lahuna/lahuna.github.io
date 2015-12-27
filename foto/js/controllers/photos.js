//*****************************************************************************************************************
// Copyright � 2014 - 2015 Lahuna. All rights reserved.
// You may not copy, reproduce, republish, disassemble, decompile, reverse engineer, post, broadcast, transmit, or
// make available to the public any content or code on this website without prior written permission from Lahuna.
//*****************************************************************************************************************

'use strict';

var ctl = angular.module('PhotosController', ['ResourceFactory', 'AuthenticateFactory']);

ctl.controller('PhotosCtrl',
  function ($scope, $routeParams, PicasaResource,
    SearchResource, Auth, $route, $rootScope) {

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

  $scope.startIndex = 1;
  $scope.maxResults = 10;

  var query = $routeParams.query;
  if (query && query.length > 0)
    $scope.search = query;
  else {
    if (!localStorage.getItem("photo_search"))
      $scope.search = "";
    else
      $scope.search = localStorage.getItem("photo_search");
  }

  $scope.$watch('search', function (value) {
    var path = $scope.startIndex + '/' + $scope.maxResults;
    if (!value || value.length == 0) {
      $scope.path = path;
    } else {
      $scope.path = value + '/' + path;
    }
  });

  function Initialize() {
    Search();
  }

  //****************************************
  // SEARCH
  //****************************************

  $scope.GoSearch = function ($event) {
    var keypressed = $event.keyCode || $event.which;
    if (keypressed == 13) {
      Search();
    }
  }

  $scope.ClickSearch = function () {
    Search();
  }

  function Search() {
    Auth.Store("photo_search", $scope.search);

    var query = $scope.search;
    PicasaResource.Get({
      'kind': 'photo',
      'q': GetSearch(),
      'start-index': $scope.startIndex,
      'max-results': $scope.maxResults,
      //'alt': 'json',
      'accessToken': GetAccessToken()
    }).$promise.then(function (data) {
      $scope.list = data;
      if (query.length > 0 && data.feed) {
        if (data.feed.entry && data.feed.entry.length > 0) {
          InsertSearch(query);
        } else {
          DeleteSearch(query);
        }
      }
    });
  }

  function GetSearch() {
    if ($scope.search.length == 0) {
      return;
    } else {
      return $scope.search;
    }
  }

  $scope.StoreId = function (photoId) {
    Auth.Store('fotoId', photoId);
  }

  //*********************************************
  // Search Suggestions
  //*********************************************

  $scope.GetSearchList = function (val) {
    return SearchResource.Get({
      query: val,
      type: "photo",
      userId: localStorage.getItem('google_user_id'),
      maxdocs: 10
    }).$promise.then(function (data) {
      return data.list;
    });
  }

  function InsertSearch(query) {
    SearchResource.Post({
      query: query,
      type: "photo",
      accessToken: GetAccessToken()
    });
  }

  function DeleteSearch(query) {
    SearchResource.Delete({
      query: query,
      type: "photo",
      accessToken: GetAccessToken()
    });
  }
});
