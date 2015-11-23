//*****************************************************************************************************************
// Copyright � 2014 - 2015 Lahuna. All rights reserved.
// You may not copy, reproduce, republish, disassemble, decompile, reverse engineer, post, broadcast, transmit, or
// make available to the public any content or code on this website without prior written permission from Lahuna.
//*****************************************************************************************************************

'use strict';

var ctl = angular.module('ChannelController', ['ResourceFactory', 'AuthenticateFactory']);

ctl.controller('ChannelCtrl', function ($scope, $routeParams, ChannelResource, Auth) {

  $scope.needSignIn = false;
  Auth.authenticate(function (result) {
    $scope.needSignIn = result;
    Initialize();
  });

  function Initialize() {

      var access_token = localStorage.getItem('youtube_access_token');
      $scope.list = ChannelResource(access_token).Get({
          part: 'snippet,contentDetails',
          maxResults: '50',
          mine: 'true'
      });
  }
});
