//*****************************************************************************************************************
// Copyright © 2014 - 2015 Lahuna. All rights reserved.
// You may not copy, reproduce, republish, disassemble, decompile, reverse engineer, post, broadcast, transmit, or
// make available to the public any content or code on this website without prior written permission from Lahuna.
//*****************************************************************************************************************

'use strict';

/* Filters */

var Filters = angular.module('Filters', []);

Filters.filter('toArray', function () {
    return function (input) {
        return input.split('\n');
    };
});

//Filters.filter('word', function () {
//    return function (input) {
//        var array = input.split(':')[0].replace(' ', ',').replace(' ', ',').replace(' ', ',').replace('/', ',').replace('.', ',').replace(')', ',').replace('(', ',').split(',');
//        //array.splice(array.indexOf(''), 10);
//        return array;
//    };
//});

//Filters.filter('whole', function () {
//    return function (input) {
//        return input.split(':')[0];
//    };
//});

//Filters.filter('def', function () {
//    return function (input) {
//        return input.split(':')[1];
//    };
//});