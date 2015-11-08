//*****************************************************************************************************************
// Copyright � 2014 - 2015 Lahuna. All rights reserved.
// You may not copy, reproduce, republish, disassemble, decompile, reverse engineer, post, broadcast, transmit, or
// make available to the public any content or code on this website without prior written permission from Lahuna.
//*****************************************************************************************************************

'use strict';

/* Services */

var Services = angular.module('Services', ['ngResource']);

// Authenticate
Services.factory('AuthenticateResource',
  function ($resource) {
      return $resource('todo/google/authenticate', {}, {
          Get: {
              method: 'GET'
          }
      });
  });

// Get Status
Services.factory('GetStatusResource', ['$resource',
  function ($resource) {
      return $resource('todo/common/get-jobs', {}, {
          Get: {
              method: 'GET'
          }
      });
  }]);

// Delete Status
Services.factory('DeleteStatusResource', ['$resource',
  function ($resource) {
      return $resource('todo/common/delete-job', {}, {
          Delete: {
              method: 'DELETE'
          }
      });
  }]);

// Get Errors
Services.factory('GetErrorsResource', ['$resource',
  function ($resource) {
      return $resource('todo/common/get-errors', {}, {
          Get: {
              method: 'GET'
          }
      });
  }]);

// Get Errors List
Services.factory('GetErrorsListResource', ['$resource',
  function ($resource) {
      return $resource('todo/common/get-errors-list', {}, {
          Get: {
              method: 'GET'
          }
      });
  }]);

// Get Error Detail
Services.factory('GetErrorDetailResource', ['$resource',
  function ($resource) {
      return $resource('todo/common/get-error-detail', {}, {
          Get: {
              method: 'GET'
          }
      });
  }]);

// Delete Error
Services.factory('DeleteErrorResource', ['$resource',
  function ($resource) {
      return $resource('todo/common/delete-error', {}, {
          Delete: {
              method: 'DELETE'
          }
      });
  }]);