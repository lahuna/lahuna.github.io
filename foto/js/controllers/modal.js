//*****************************************************************************************************************
// Copyright � 2014 - 2015 Lahuna. All rights reserved.
// You may not copy, reproduce, republish, disassemble, decompile, reverse engineer, post, broadcast, transmit, or
// make available to the public any content or code on this website without prior written permission from Lahuna.
//*****************************************************************************************************************

'use strict';

var ctl = angular.module('ModalInstanceController', ['ResourceFactory', 'AuthenticateFactory']);

ctl.controller('ModalInstanceCtrl', function ($scope, $modalInstance, items, photoId) {

    $scope.items = items;
    $scope.selected = {
        item: $scope.items[0]
    };

    $scope.photoId = photoId;

    $scope.ok = function () {
        $modalInstance.close($scope.selected.item);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});
