//*****************************************************************************************************************
// Copyright © 2014 - 2015 Lahuna. All rights reserved.
// You may not copy, reproduce, republish, disassemble, decompile, reverse engineer, post, broadcast, transmit, or
// make available to the public any content or code on this website without prior written permission from Lahuna.
//*****************************************************************************************************************

'use strict';

/* Controllers */

var Controllers = angular.module('Controllers', []);

Controllers.controller('MainCtrl', ['$scope', '$routeParams',
    function ($scope, $routeParams) {

    }]);

Controllers.controller('ContactCtrl', ['$scope', 'SendEmailResource',
    function ($scope, SendEmailResource) {

        ClearForm(true);

        $scope.SendEmail = function () {

            $scope.alertClass = "alert alert-warning";
            $scope.response = "Sending message...";

            SendEmailResource.Send({
                subject: $scope.subject,
                body: $scope.body,
                to: "Lahuna",
                fromAddress: $scope.fromAddress,
                firstName: $scope.firstName,
                lastName: $scope.lastName
            })
            .$promise.then(function (data) {
                $scope.response = data.message;
                if (data.message == "Message sent successfully") {
                    $scope.alertClass = "alert alert-success";
                    ClearForm(false);
                }
                else
                    $scope.alertClass = "alert alert-danger";
            });
        }

        $scope.ClearForm = function () {
            ClearForm(true);
        }

        function ClearForm(clearMessage) {
            $scope.subject = "";
            $scope.body = "";
            $scope.fromAddress = "";
            $scope.firstName = "";
            $scope.lastName = "";

            if (clearMessage) {
                $scope.response = "";
                $scope.alertClass = "";
            }
        }
    }]);

Controllers.controller('RestCtrl', ['$scope', 'GetApiResource',
    function ($scope, GetApiResource) {

        $scope.accessToken = localStorage.getItem("rest_access_token");
        $scope.origin = localStorage.getItem("rest_origin");
        $scope.pathname = localStorage.getItem("rest_pathname");
        $scope.search = localStorage.getItem("rest_search");

        $scope.Send = function () {

            localStorage.setItem("rest_access_token", $scope.accessToken);
            localStorage.setItem("rest_origin", $scope.origin);
            localStorage.setItem("rest_pathname", $scope.pathname);
            localStorage.setItem("rest_search", $scope.search);

            GetApiResource.Get({
                accessToken: $scope.accessToken,
                origin: $scope.origin,
                pathname: $scope.pathname,
                search: $scope.search
            })
            .$promise.then(function (data) {
                $scope.response = data;
            }, function (error) {
                $scope.response = error;
            });
        }

        $scope.Clear = function () {
            Clear();
        }

        function Clear() {
            $scope.accessToken = "";
            $scope.origin = "";
            $scope.pathname = "";
            $scope.search = "";
            $scope.response = "";
            localStorage.setItem("rest_access_token", $scope.accessToken);
            localStorage.setItem("rest_origin", $scope.origin);
            localStorage.setItem("rest_pathname", $scope.pathname);
            localStorage.setItem("rest_search", $scope.search);
        }
    }]);