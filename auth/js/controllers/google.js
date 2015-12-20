//*****************************************************************************************************************
// Copyright � 2014 - 2015 Lahuna. All rights reserved.
// You may not copy, reproduce, republish, disassemble, decompile, reverse engineer, post, broadcast, transmit, or
// make available to the public any content or code on this website without prior written permission from Lahuna.
//*****************************************************************************************************************

'use strict';

var ctl = angular.module('GoogleController', ['AuthResourceFactory']);

ctl.controller('GoogleCtrl', function ($scope, $routeParams, $modal, $location,
  GoogleAccessTokenResource, UserResource, GoogleProfileResource) {

        var code = $routeParams.code.replace('xxxx', '/');

        GoogleAccessTokenResource.Post({ code: code, redirectUri: location.origin + "/auth/google" })
            .$promise.then(function (token) {
                StoreTokens(token);

                //GetProfile(token);
            });

        //function GetProfile(token) {
        //    GoogleProfileResource(token.access_token).Get()
        //        .$promise.then(function (profile) {
        //            $scope.profile = profile;
        //            GetUser(token, profile);
        //        });
        //}

        function StoreTokens(token) {
            $scope.access_token = token.access_token;
            $scope.refresh_token = token.refresh_token;
            switch ($routeParams.state) {
                case "foto":
                    localStorage.setItem("google_access_token", token.access_token);
                    localStorage.setItem("google_expires_in", token.expires_in);
                    localStorage.setItem("google_refresh_token", token.refresh_token);
                    break;

                case "vida":
                    localStorage.setItem("youtube_access_token", token.access_token);
                    localStorage.setItem("youtube_expires_in", token.expires_in);
                    localStorage.setItem("youtube_refresh_token", token.refresh_token);
                    break;

                case "blitz":
                    localStorage.setItem("blogger_access_token", token.access_token);
                    localStorage.setItem("blogger_expires_in", token.expires_in);
                    localStorage.setItem("blogger_refresh_token", token.refresh_token);
                    break;
            }

            GetUser(token);
        }

        function GetUser(token) {
            UserResource.Get({
              accessToken: token.access_token
            }).$promise.then(function (data) {
                if (data.message == 'Found')
                    Reroute();
                    //UpdateUser(token);
                else
                    location.href = '/auth/#/agree/' + $routeParams.state;
                    //AgreePrompt();
                });
        }

        //function UpdateUser(token) {
        //    UpdateUserResource(token.access_token, token.refresh_token).Update()
        //        .$promise.then(function (data) {
        //            Reroute();
        //        });
        //}

        //function AgreePrompt() {
        //    var modalInstance = $modal.open({
        //        templateUrl: 'views/modal.html',
        //        controller: 'ModalInstanceCtrl',
        //        animation: true,
        //        backdrop: true,
        //        size: 'sm'
        //    });

        //    modalInstance.result.then(function (result) {
        //        if (result == 'ok')
        //            CreateUser();
        //    })
        //}

        //function CreateUser() {
        //    CreateUserResource($scope.access_token, $scope.refresh_token).Create({
        //        userId: $scope.profile.id,
        //        agreedDate: Date(),
        //        displayName: $scope.profile.displayName,
        //        email: $scope.profile.emails[0].value
        //    }).$promise.then(function () {
        //        Reroute();
        //    });
        //}



        function Reroute() {
            switch ($routeParams.state) {
                case "foto":
                    location.href = "/foto";
                    break;

                case "vida":
                    location.href = "/vida";
                    break;

                case "blitz":
                    location.href = "/blitz";
                    break;

                default:
                    $location.path('/');
            }
        }
    });
