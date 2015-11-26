//*****************************************************************************************************************
// Copyright � 2014 - 2015 Lahuna. All rights reserved.
// You may not copy, reproduce, republish, disassemble, decompile, reverse engineer, post, broadcast, transmit, or
// make available to the public any content or code on this website without prior written permission from Lahuna.
//*****************************************************************************************************************

'use strict';

var ctl = angular.module('ContactController', ['Resources']);

ctl.controller('ContactCtrl', function ($scope, EmailResource) {

  ClearForm(true);

  $scope.SendEmail = function () {

    $scope.alertClass = "alert alert-warning";
    $scope.response = "Sending message...";

    EmailResource.Send({
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
});
