//*****************************************************************************************************************
// Copyright 2014-2019 Lahuna. All rights reserved.
// You may not copy, reproduce, republish, disassemble, decompile, reverse engineer, post, broadcast, transmit, or
// make available to the public any content or code on this website without prior written permission from Lahuna.
//*****************************************************************************************************************

'use strict';

var ctl = angular.module('LogController', ['Resources']);

ctl.controller('LogCtrl', function ($scope, $routeParams, $location, LogResource) {
  var ip = $routeParams.ip;
  $scope.ip = ip;
  $scope.log = LogResource.Get({
    'type': 'log',
    'ip': ip
  });

  $scope.delete = function(index, id) {
    $scope.log.list.splice(index, 1);
    LogResource.Delete({
      '_id': id,
      'type': 'log'
    });
  }

  $scope.deleteAll = function() {
    $scope.log = undefined;
    LogResource.Delete({
      'type': 'log'
    });
  }
});
