//*****************************************************************************************************************
// Copyright © 2014 - 2015 Lahuna. All rights reserved.
// You may not copy, reproduce, republish, disassemble, decompile, reverse engineer, post, broadcast, transmit, or
// make available to the public any content or code on this website without prior written permission from Lahuna.
//*****************************************************************************************************************

'use strict';

/* Filters */

var Filters = angular.module('Filters', []);

Filters.filter('checkmark', function () {
    return function (input) {
        return input ? '\u2713' : '\u2718';
    };
});

Filters.filter('cmdate', function () {
    return function (input) {
        if (input !== undefined)
            return new Date(input).toLocaleString();
        else
            return '';
    };
});

Filters.filter('timestamp', function () {
    return function (input) {
        if (input !== undefined)
            return new Date(Number(input)).toLocaleString();
        else
            return '';
    };
});

Filters.filter('number', function () {
    return function (input) {
        if (input !== undefined)
            return new Number(input).toLocaleString();
        else
            return '';
    };
});

Filters.filter('tofraction', function () {
    return function (input) {
        if (input !== undefined)
            if (Number(input) < 1)
                return '1/' + (parseInt(1 / Number(input)))
            else
                return input;
        else
            return '';
    };
});

Filters.filter('enlarge', function () {
    return function (input) {
        if (input != undefined)
            return input.replace('s72', 's1000');
        else
            return input;
    };
});

Filters.filter('type', function () {
    return function (input) {
        if (input == undefined)
            return 'photo';
        else
            return 'video';
    };
});

//Filters.filter('type', function () {
//    return function (input) {
//        if (input == undefined)
//            return photo.media$group.media$thumbnail.url[0].replace('s72', 's1000');
//        else
//            return '#/video/viewer/' + photo.gphoto$id.$t;
//    };
//});

Filters.filter('thumb', function () {
    return function (input) {
        if (input.indexOf('s72') > -1)
            return input.replace('s72', 's100-c');
        else if (input.indexOf('s160-c') > -1)
            return input.replace('s160-c', 's100-c');
        else
            return input;
    };
});

Filters.filter('day', function () {
    return function (input) {
        return input.substring(8);
    };
});

Filters.filter('truncString', function () {
    return function (input) {
        return input.substring(0, 30) + "...";
    };
});

Filters.filter('escape', function () {
    return function (input) {
        return input.replace(/ /g, "%20");
    };
});

Filters.filter('unit', function () {
    return function (input) {
        if (input == "Other Albums")
            return "Albums";
        else
            return "Days";
    };
});

Filters.filter('sum', function () {
    return function (input) {
        if (input == undefined)
            return 0;
        var i = 0;
        var photoCount = 0;
        for (i = 0; i < input.length; i++) {
            photoCount += Number(input[i].NumPhotos);
        }
        return photoCount;
    };
});