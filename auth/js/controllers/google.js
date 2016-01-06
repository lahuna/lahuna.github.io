//*****************************************************************************************************************
// Copyright � 2014 - 2015 Lahuna. All rights reserved.
// You may not copy, reproduce, republish, disassemble, decompile, reverse engineer, post, broadcast, transmit, or
// make available to the public any content or code on this website without prior written permission from Lahuna.
//*****************************************************************************************************************

'use strict';

var ctl = angular.module('GoogleController', ['AuthenticateFactory', 'AuthResourceFactory']);

ctl.controller('GoogleCtrl', function ($scope, $routeParams,
  GoogleAccessTokenResource, UserResource, Auth) {

      //localStorage.getItem('code');
      //localStorage.getItem('state');

        //var code = $routeParams.code.replace('xxxx', '/');

        GoogleAccessTokenResource.Post({
          'code': localStorage.getItem('code'),
          'redirectUri': location.origin + "/auth/google" })
        .$promise.then(function (token) {
          if (!token.error) {
            StoreTokens(token);
          }
            //GetProfile(token);
        });

        //function GetProfile(token) {
        //    GoogleProfileResource(token.access_token).Get()
        //        .$promise.then(function (profile) {
        //            $scope.profile = profile;
        //            GetUser(token, profile);
        //        });
        //}

        /*function StoreTokens(token) {
          var state = localStorage.getItem('state');
          if (state.indexOf('foto') > -1) {
            Auth.Store("google_access_token", token.access_token);
            Auth.Store("google_expires_in", token.expires_in);
            Auth.Store("google_refresh_token", token.refresh_token);
          } else if (state.indexOf('vida') > -1) {
            Auth.Store("youtube_access_token", token.access_token);
            Auth.Store("youtube_expires_in", token.expires_in);
            Auth.Store("youtube_refresh_token", token.refresh_token);
          } else if (state.indexOf('blitz') > -1) {
            Auth.Store("blogger_access_token", token.access_token);
            Auth.Store("blogger_expires_in", token.expires_in);
            Auth.Store("blogger_refresh_token", token.refresh_token);
          }

          GetUser(token);
        }*/

        function StoreTokens(token) {
            //$scope.access_token = token.access_token;
            //$scope.refresh_token = token.refresh_token;
            switch ($routeParams.state) {
                case "foto":
                    Auth.Store("google_access_token", token.access_token);
                    Auth.Store("google_expires_in", token.expires_in);
                    Auth.Store("google_refresh_token", token.refresh_token);
                    break;

                case "vida":
                    Auth.Store("youtube_access_token", token.access_token);
                    Auth.Store("youtube_expires_in", token.expires_in);
                    Auth.Store("youtube_refresh_token", token.refresh_token);
                    break;

                case "blitz":
                    Auth.Store("blogger_access_token", token.access_token);
                    Auth.Store("blogger_expires_in", token.expires_in);
                    Auth.Store("blogger_refresh_token", token.refresh_token);
                    break;
            }

            GetUser(token.access_token);
        }

        function GetUser(accessToken) {
            UserResource.Get({
              'accessToken': accessToken
            }).$promise.then(function (data) {
                if (data.message == 'Found') {
                  location.href = localStorage.getItem('auth_redirect');
                    //Reroute();
                    //UpdateUser(token);
                } else
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



        /*function Reroute() {
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
        }*/
    });
