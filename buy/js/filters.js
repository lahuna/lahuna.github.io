//*****************************************************************************************************************
// Copyright � 2014 - 2016 Lahuna. All rights reserved.
// You may not copy, reproduce, republish, disassemble, decompile, reverse engineer, post, broadcast, transmit, or
// make available to the public any content or code on this website without prior written permission from Lahuna.
//*****************************************************************************************************************

'use strict';

var fil = angular.module('Filters', []);

fil.filter('profile', function () {
    return function (input) {
        if (input)
            return input.replace('sz=50', 'sz=35');
        else
            return input;
    };
});

fil.filter('all', function () {
    return function (input) {
        if (input)
            return input;
        else
            return 'all';
    };
});
