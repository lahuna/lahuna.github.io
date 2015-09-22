//*****************************************************************************************************************
// Copyright © 2014 - 2015 Lahuna. All rights reserved.
// You may not copy, reproduce, republish, disassemble, decompile, reverse engineer, post, broadcast, transmit, or
// make available to the public any content or code on this website without prior written permission from Lahuna.
//*****************************************************************************************************************

'use strict';

/* Filters */

var Filters = angular.module('Filters', []);

Filters.filter('stringify', function () {
    return function (input) {
        return JSON.stringify(input);
    };
});

Filters.filter('default', function () {
    return function (input) {
        if (input == undefined)
            return '#/facebook';
        else
            return input;
    };
});

Filters.filter('window', function () {
    return function (input) {
        if (input == undefined)
            return '_self';
        else
            return "_blank";
    };
});