//*****************************************************************************************************************
// Copyright � 2014 - 2016 Lahuna. All rights reserved.
// You may not copy, reproduce, republish, disassemble, decompile, reverse engineer, post, broadcast, transmit, or
// make available to the public any content or code on this website without prior written permission from Lahuna.
//*****************************************************************************************************************

'use strict';

var fil = angular.module('Filters', []);

fil.filter('stringify', function () {
    return function (input) {
        return JSON.stringify(input);
    };
});

fil.filter('default', function () {
    return function (input) {
        if (!input)
            return '#/facebook';
        else
            return input;
    };
});

fil.filter('window', function () {
    return function (input) {
        if (!input)
            return '_self';
        else
            return "_blank";
    };
});
