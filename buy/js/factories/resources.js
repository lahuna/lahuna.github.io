//*****************************************************************************************************************
// Copyright � 2014 - 2016 Lahuna. All rights reserved.
// You may not copy, reproduce, republish, disassemble, decompile, reverse engineer, post, broadcast, transmit, or
// make available to the public any content or code on this website without prior written permission from Lahuna.
//*****************************************************************************************************************

'use strict';

var fac = angular.module('ResourceFactory', ['ngResource']);

fac.factory('AuthenticateResource', function ($resource) {
  return $resource('https://' + location.hostname + ':8000/google/authenticate', {}, {
    Get: {
      method: 'GET'
    }
  });
});

fac.factory('StoreResource', function ($resource) {
  return $resource('https://' + location.hostname + ':8000/store', {}, {
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
  return $resource('https://' + location.hostname + ':8000/category', {}, {
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
  return $resource('https://' + location.hostname + ':8000/product', {}, {
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

fac.factory('CartResource', function ($resource) {
  return $resource('https://' + location.hostname + ':8000/cart', {}, {
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

fac.factory('CartItemResource', function ($resource) {
  return $resource('https://' + location.hostname + ':8000/cart_item', {}, {
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

fac.factory('OrderResource', function ($resource) {
  return $resource('https://' + location.hostname + ':8000/order', {}, {
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
  return $resource('https://' + location.hostname + ':8000/search', {}, {
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

fac.factory('StripeCheckoutResource', function ($resource) {
  return $resource('https://' + location.hostname + ':8000/stripe/checkout', {}, {
    Post: {
      method: 'POST'
    }
  });
});
