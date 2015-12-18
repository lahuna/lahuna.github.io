//*****************************************************************************************************************
// Copyright � 2014 - 2015 Lahuna. All rights reserved.
// You may not copy, reproduce, republish, disassemble, decompile, reverse engineer, post, broadcast, transmit, or
// make available to the public any content or code on this website without prior written permission from Lahuna.
//*****************************************************************************************************************

'use strict';

/* Controllers */

var Controllers = angular.module('Controllers', []);

Controllers.controller('MainCtrl',
  function ($scope, $routeParams) {

  });

Controllers.controller('StatusCtrl',
  function ($scope, $routeParams, GetStatusResource, DeleteStatusResource, AuthenticateResource) {

      //****************************************
      // AUTHENTICATE
      //****************************************

      // Authenticate
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
          switch ($routeParams.app) {
              case "foto":
              case "all":
                  localStorage.setItem("google_access_token", data.access_token);
                  localStorage.setItem("google_user_id", data.user_id);
                  localStorage.setItem("google_expires_in", data.expires_in);
                  break;

              case "vida":
                  localStorage.setItem("youtube_access_token", data.access_token);
                  localStorage.setItem("youtube_user_id", data.user_id);
                  localStorage.setItem("youtube_expires_in", data.expires_in);
                  break;
          }

          Initialize();
      }

      function GetAccessToken() {

          switch ($routeParams.app) {
              case "foto":
              case "all":
                  return localStorage.getItem("google_access_token");
                  break;

              case "vida":
                  return localStorage.getItem("youtube_access_token");
                  break;
          }
      }

      function GetRefreshToken() {

          switch ($routeParams.app) {
              case "foto":
              case "all":
                  return localStorage.getItem("google_refresh_token");
                  break;

              case "vida":
                  return localStorage.getItem("youtube_refresh_token");
                  break;
          }
      }

      //****************************************
      // INITIALIZE
      //****************************************

      function Initialize() {
          $scope.items = GetStatusResource.Get({
              accessToken: GetAccessToken()
          });
      }

      $scope.Refresh = function () {
          $scope.items = GetStatusResource.Get({
              accessToken: GetAccessToken()
          });
      };

      $scope.Delete = function (item) {
          var index = $scope.items.list.indexOf(item);
          $scope.items.list.splice(index, 1);
          DeleteStatusResource.Delete({
              jobId: item.cId,
              accessToken: GetAccessToken()
          });
      };
  });

Controllers.controller('ErrorsCtrl',
  function ($scope, $routeParams, GetErrorsResource, AuthenticateResource) {

      //****************************************
      // AUTHENTICATE
      //****************************************

      // Authenticate
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
          switch ($routeParams.app) {
              case "foto":
              case "all":
                  localStorage.setItem("google_access_token", data.access_token);
                  localStorage.setItem("google_user_id", data.user_id);
                  localStorage.setItem("google_expires_in", data.expires_in);
                  break;

              case "vida":
                  localStorage.setItem("youtube_access_token", data.access_token);
                  localStorage.setItem("youtube_user_id", data.user_id);
                  localStorage.setItem("youtube_expires_in", data.expires_in);
                  break;
          }

          Initialize();
      }

      function GetAccessToken() {

          switch ($routeParams.app) {
              case "foto":
              case "all":
                  return localStorage.getItem("google_access_token");
                  break;

              case "vida":
                  return localStorage.getItem("youtube_access_token");
                  break;
          }
      }

      function GetRefreshToken() {

          switch ($routeParams.app) {
              case "foto":
              case "all":
                  return localStorage.getItem("google_refresh_token");
                  break;

              case "vida":
                  return localStorage.getItem("youtube_refresh_token");
                  break;
          }
      }

      //****************************************
      // INITIALIZE
      //****************************************

      function Initialize() {
          $scope.items = GetErrorsResource.Get({
              jobId: $routeParams.jobId,
              accessToken: GetAccessToken()
          });

          $scope.jobId = $routeParams.jobId;
      }
  });

Controllers.controller('ErrorsListCtrl',
  function ($scope, $routeParams, GetErrorsListResource, DeleteErrorResource, AuthenticateResource) {

      //****************************************
      // AUTHENTICATE
      //****************************************

      // Authenticate
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
          switch ($routeParams.app) {
              case "foto":
              case "all":
                  localStorage.setItem("google_access_token", data.access_token);
                  localStorage.setItem("google_user_id", data.user_id);
                  localStorage.setItem("google_expires_in", data.expires_in);
                  break;

              case "vida":
                  localStorage.setItem("youtube_access_token", data.access_token);
                  localStorage.setItem("youtube_user_id", data.user_id);
                  localStorage.setItem("youtube_expires_in", data.expires_in);
                  break;
          }

          Initialize();
      }

      function GetAccessToken() {

          switch ($routeParams.app) {
              case "foto":
              case "all":
                  return localStorage.getItem("google_access_token");
                  break;

              case "vida":
                  return localStorage.getItem("youtube_access_token");
                  break;
          }
      }

      function GetRefreshToken() {

          switch ($routeParams.app) {
              case "foto":
              case "all":
                  return localStorage.getItem("google_refresh_token");
                  break;

              case "vida":
                  return localStorage.getItem("youtube_refresh_token");
                  break;
          }
      }

      //****************************************
      // INITIALIZE
      //****************************************

      function Initialize() {
          $scope.items = GetErrorsListResource.Get({
              errorIds: $routeParams.errorIds,
              accessToken: GetAccessToken()
          });
      }

      $scope.Delete = function (item) {
          var index = $scope.items.list.indexOf(item);
          $scope.items.list.splice(index, 1);
          DeleteErrorResource.Delete({
              errorId: item.Id,
              accessToken: GetAccessToken()
          });
      };
  });

Controllers.controller('ErrorDetailCtrl',
  function ($scope, $routeParams, GetErrorDetailResource, AuthenticateResource) {

      //****************************************
      // AUTHENTICATE
      //****************************************

      // Authenticate
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
          switch ($routeParams.app) {
              case "foto":
              case "all":
                  localStorage.setItem("google_access_token", data.access_token);
                  localStorage.setItem("google_user_id", data.user_id);
                  localStorage.setItem("google_expires_in", data.expires_in);
                  break;

              case "vida":
                  localStorage.setItem("youtube_access_token", data.access_token);
                  localStorage.setItem("youtube_user_id", data.user_id);
                  localStorage.setItem("youtube_expires_in", data.expires_in);
                  break;
          }

          Initialize();
      }

      function GetAccessToken() {

          switch ($routeParams.app) {
              case "foto":
              case "all":
                  return localStorage.getItem("google_access_token");
                  break;

              case "vida":
                  return localStorage.getItem("youtube_access_token");
                  break;
          }
      }

      function GetRefreshToken() {

          switch ($routeParams.app) {
              case "foto":
              case "all":
                  return localStorage.getItem("google_refresh_token");
                  break;

              case "vida":
                  return localStorage.getItem("youtube_refresh_token");
                  break;
          }
      }

      //****************************************
      // INITIALIZE
      //****************************************

      function Initialize() {
          $scope.detail = GetErrorDetailResource.Get({
              errorId: $routeParams.errorId,
              accessToken: GetAccessToken()
          });
      }
  });
