//*****************************************************************************************************************
// Copyright 2014 - 2017 Lahuna. All rights reserved.
// You may not copy, reproduce, republish, disassemble, decompile, reverse engineer, post, broadcast, transmit, or
// make available to the public any content or code on this website without prior written permission from Lahuna.
//*****************************************************************************************************************

'use strict';

var fac = angular.module('ResourceFactory', ['ngResource']);

fac.factory('AuthenticateResource', function ($resource) {
  return $resource('https://lahuna.net/google/authenticate', {}, {
    Get: {
      method: 'GET'
    }
  });
});

fac.factory('StoreResource', function ($resource) {
  return $resource('https://lahuna.net/store', {}, {
    Get: {
      method: 'GET'
    },
    Post: {
      method: 'POST'
    },
    Put: {
      method: 'PUT'
    },
    Delete: {
      method: 'DELETE'
    },
  });
});

fac.factory('CategoryResource', function ($resource) {
  return $resource('https://lahuna.net/category', {}, {
    Get: {
      method: 'GET'
    },
    Post: {
      method: 'POST'
    },
    Put: {
      method: 'PUT'
    },
    Delete: {
      method: 'DELETE'
    },
  });
});

fac.factory('ProductResource', function ($resource) {
  return $resource('https://lahuna.net/product', {}, {
    Get: {
      method: 'GET'
    },
    Post: {
      method: 'POST'
    },
    Put: {
      method: 'PUT'
    },
    Delete: {
      method: 'DELETE'
    },
  });
});

fac.factory('SearchResource', function ($resource) {
  return $resource('https://lahuna.net/search', {}, {
    Get: {
      method: 'GET'
    },
    Post: {
      method: 'POST'
    },
    Delete: {
      method: 'DELETE'
    }
  });
});

fac.factory('StripeAccessTokenResource', function ($resource) {
  return $resource('https://lahuna.net/stripe/access_token', {}, {
    Post: {
      method: 'POST'
    }
  });
});

fac.factory('StripeMerchantResource', function ($resource) {
  return $resource('https://lahuna.net/stripe/merchant', {}, {
    Get: {
      method: 'GET'
    }
  });
});
