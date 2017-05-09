//*****************************************************************************************************************
// Copyright 2014 - 2017 Lahuna. All rights reserved.
// You may not copy, reproduce, republish, disassemble, decompile, reverse engineer, post, broadcast, transmit, or
// make available to the public any content or code on this website without prior written permission from Lahuna.
//*****************************************************************************************************************

'use strict';

var ctl = angular.module('ModalInstanceController', ['ResourceFactory', 'AuthenticateFactory']);

ctl.controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, photoId, type) {

    $scope.photoId = photoId;
    $scope.type = type;

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});
