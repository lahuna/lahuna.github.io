//*****************************************************************************************************************
// Copyright 2014 - 2017 Lahuna. All rights reserved.
// You may not copy, reproduce, republish, disassemble, decompile, reverse engineer, post, broadcast, transmit, or
// make available to the public any content or code on this website without prior written permission from Chanthu Oeur.
//*****************************************************************************************************************

'use strict';

var ctl = angular.module('WikiController', ['Resources']);

ctl.controller('WikiExtractCtrl', function ($sce, $scope, $routeParams, $location,
  LogResource, WikiResource) {
  LogResource.Post({
    'path': $location.$$path
  });

  $scope.title = $routeParams.title;

  WikiResource.Get({
    titles: $routeParams.title,
    action: 'query',
    prop: 'extracts',
    format: 'json'
  }).$promise.then(function (data) {
    var pageId = getPageId(data.query.pages);
    var extract = data.query.pages[pageId].extract;
    if (!extract) {
      $scope.msg = 'No extract found for: ' + $routeParams.title;
      return;
    }
    $scope.msg = 'Wikipedia extract for: ' + $routeParams.title;
    $scope.info = $sce.trustAsHtml(extract);
  });

  function getPageId(pages) {
    for (var pageId in pages) {
      return pageId;
    }
  }
});
