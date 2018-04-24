//*****************************************************************************************************************
// Copyright 2014-2018 Lahuna. All rights reserved.
// You may not copy, reproduce, republish, disassemble, decompile, reverse engineer, post, broadcast, transmit, or
// make available to the public any content or code on this website without prior written permission from Lahuna.
//*****************************************************************************************************************

var fac = angular.module('OboeFactory', []);

fac.factory('Oboe', function ($q) {
  return { 'get': get };

  function get (url) {
    var defer = $q.defer();
    oboe(url)
      .fail(function (error) {
        defer.reject(error);
      })
      .node('!', function (node) {
        defer.notify(node);
        return oboe.drop;
      });
    return defer.promise;
  }
});
