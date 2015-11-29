//*****************************************************************************************************************
// Copyright © 2014 - 2015 Lahuna. All rights reserved.
// You may not copy, reproduce, republish, disassemble, decompile, reverse engineer, post, broadcast, transmit, or
// make available to the public any content or code on this website without prior written permission from Lahuna.
//*****************************************************************************************************************

'use strict';

/* Controllers */

var Controllers = angular.module('Controllers', []);

Controllers.controller('MainCtrl',
    function ($scope, $routeParams, WhoisResource) {

        $scope.list = [];

        if (localStorage.getItem("purl-text") == undefined)
            localStorage.setItem("purl-text", "");

        $scope.tArea = localStorage.getItem("purl-text");

        //$scope.$watch('tArea', function (value) {
        //    $scope.list = value.split('\n');
        //    localStorage.setItem("purl-text", value);
        //});

        $scope.Push = function () {
            var items = $scope.tArea.split(':')[0].replace(' ', ',').replace(' ', ',').replace(' ', ',').replace('/', ',').replace('.', ',').replace(')', ',').replace('(', ',').split(',');
            var i = 0;
            var j = 0;
            for (i = 0; i < items.length; i++) {
                var iItem = items[i];
                for (j = 0; j < iItem.length; j++) {
                    var item = iItem[j];
                    if (item != "")
                        list.push(item);
                }
            }
        }

        $scope.Get = function () {
            WhoisResource.Get({
                q: $scope.url
            }).$promise.then(function (data) {
                //$scope.result = data.message;
                if (data.html.indexOf('No match for domain') > 0)
                    $scope.result = 'Available';
                else
                    $scope.result = 'Not Available';
            }, function (error) {
                var test = error;
            });
        }

    });
