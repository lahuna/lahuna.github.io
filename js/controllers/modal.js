//*****************************************************************************************************************
// Copyright � 2014 - 2016 Lahuna. All rights reserved.
// You may not copy, reproduce, republish, disassemble, decompile, reverse engineer, post, broadcast, transmit, or
// make available to the public any content or code on this website without prior written permission from Lahuna.
//*****************************************************************************************************************

'use strict';

var ctl = angular.module('ModalInstanceController', []);

ctl.controller('ModalInstanceCtrl', function ($scope, $modalInstance, title, btn, msg) {

  $scope.title = title;
  $scope.btn = btn;
  $scope.msg = msg;

    $scope.ok = function () {
        $modalInstance.close('ok');
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});
