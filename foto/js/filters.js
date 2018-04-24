//*****************************************************************************************************************
// Copyright 2014-2018 Lahuna. All rights reserved.
// You may not copy, reproduce, republish, disassemble, decompile, reverse engineer, post, broadcast, transmit, or
// make available to the public any content or code on this website without prior written permission from Lahuna.
//*****************************************************************************************************************

'use strict';

/* fil */

var fil = angular.module('Filters', []);

fil.filter('checkmark', function () {
    return function (input) {
        return input ? '\u2713' : '\u2718';
    };
});

fil.filter('profile', function () {
    return function (input) {
        if (input)
            return input.replace('sz=50', 'sz=35');
        else
            return input;
    };
});

fil.filter('cmdate', function () {
    return function (input) {
        if (input)
            return new Date(input).toLocaleString();
        else
            return '';
    };
});

fil.filter('timestamp', function () {
    return function (input) {
        if (input)
            return new Date(Number(input)).toLocaleString();
        else
            return '';
    };
});

fil.filter('number', function () {
    return function (input) {
        if (input)
            return new Number(input).toLocaleString();
        else
            return '';
    };
});

fil.filter('tofraction', function () {
    return function (input) {
        if (input)
            if (Number(input) < 1)
                return '1/' + (parseInt(1 / Number(input)))
            else
                return input;
        else
            return '';
    };
});

fil.filter('enlarge', function () {
    return function (input) {
        if (input)
            return input.replace('s72', 's1000');
        else
            return input;
    };
});

fil.filter('type', function () {
    return function (input) {
        if (!input)
            return 'photo';
        else
            return 'video';
    };
});

//fil.filter('type', function () {
//    return function (input) {
//        if (input == undefined)
//            return photo.media$group.media$thumbnail.url[0].replace('s72', 's1000');
//        else
//            return '#/video/viewer/' + photo.gphoto$id.$t;
//    };
//});

fil.filter('thumb', function () {
    return function (input) {
        if (input.indexOf('s72') > -1)
            return input.replace('s72', 's100-c');
        else if (input.indexOf('s160-c') > -1)
            return input.replace('s160-c', 's100-c');
        else
            return input;
    };
});

fil.filter('thumbAlbum', function () {
    return function (input) {
        if (input.indexOf('s72') > -1)
            return input.replace('s72', 's160-c');
        else
            return input;
    };
});

fil.filter('day', function () {
    return function (input) {
        return input.substring(8);
    };
});

fil.filter('truncString', function () {
    return function (input) {
        return input.substring(0, 30) + "...";
    };
});

fil.filter('escape', function () {
    return function (input) {
        return input.replace(/ /g, "%20");
    };
});

fil.filter('unit', function () {
    return function (input) {
        if (input == "Other Albums")
            return "Albums";
        else
            return "Days";
    };
});

fil.filter('sum', function () {
    return function (input) {
        if (input)
            return 0;
        var i = 0;
        var photoCount = 0;
        for (i = 0; i < input.length; i++) {
            photoCount += Number(input[i].NumPhotos);
        }
        return photoCount;
    };
});
