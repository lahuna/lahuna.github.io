//*****************************************************************************************************************
// Copyright � 2014 - 2015 Lahuna. All rights reserved.
// You may not copy, reproduce, republish, disassemble, decompile, reverse engineer, post, broadcast, transmit, or
// make available to the public any content or code on this website without prior written permission from Lahuna.
//*****************************************************************************************************************

'use strict';

var ctl = angular.module('AgreeController', ['AuthResourceFactory', 'OboeFactory']);

ctl.controller('AgreeCtrl', function ($scope, $routeParams, $modal, $location,
        UserResource, GoogleProfileResource, Oboe) {

        $scope.Agree = function () {
            GetTokens();
        }

        function GetTokens() {
            switch ($routeParams.state) {
                case "foto":
                    $scope.access_token = localStorage.getItem("google_access_token");
                    $scope.refresh_token = localStorage.getItem("google_refresh_token");
                    break;

                case "vida":
                    $scope.access_token = localStorage.getItem("youtube_access_token");
                    $scope.refresh_token = localStorage.getItem("youtube_refresh_token");
                    break;

                case "blitz":
                    $scope.access_token = localStorage.getItem("blogger_access_token");
                    $scope.refresh_token = localStorage.getItem("blogger_refresh_token");
                    break;
            }

            GetProfile();
        }

        function GetProfile() {
            GoogleProfileResource($scope.access_token).Get()
                .$promise.then(function (profile) {
                    CreateUser(profile);
                });
        }

        function CreateUser(profile) {
            UserResource.Post({
                agreedDate: Date(),
                displayName: profile.displayName,
                email: profile.emails[0].value,
                app: $routeParams.state,
                accessToken: $scope.access_token
            }).$promise.then(function () {
                Reroute();
            });
        }

        function Reroute() {
            switch ($routeParams.state) {
                case "foto":
                    //location.href = "/foto/#/initial";
                    Import();
                    location.href = "/foto";
                    break;

                case "vida":
                    //location.href = "/vida/#/initial";
                    Import();
                    location.href = "/vida";
                    break;

                case "blitz":
                    location.href = "/blitz";
                    break;

                default:
                    $location.path('/');
            }
        }

        function Import() {
          Oboe.get({url: location.origin + ':8080/' + $routeParams.state + '/import?accessToken=' + $scope.access_token}
          ).then(function() {
              // finished loading
          }, function(error) {
              // handle errors
          }, function(node) {
              // handle node data
          });
        }
    });
