//*****************************************************************************************************************
// Copyright � 2014 - 2015 Lahuna. All rights reserved.
// You may not copy, reproduce, republish, disassemble, decompile, reverse engineer, post, broadcast, transmit, or
// make available to the public any content or code on this website without prior written permission from Lahuna.
//*****************************************************************************************************************

'use strict';

var fil = angular.module('Filters', []);

//fil.filter('ytChannelUrl', function () {
//    return function (input) {
//        if (input.channelTitle != "")
//            return input.channelTitle;
//        else if (input.channelId != "")
//            return input.channelId;
//        else
//            return "** NO TITLE FOUND **";
//    };
//});

fil.filter('ytChannelTitle', function () {
    return function (input) {
        if (input.channelTitle.length > 0)
            return input.channelTitle;
        else if (input.title.length > 0)
            return input.title;
        else
            return "** NO TITLE FOUND **";
    };
});

//fil.filter('activityUrl', function () {
//    return function (input) {
//        if (input == undefined)
//            return "** NO URL FOUND **";

//        if (input.contentDetails == undefined)
//            return "** NO URL FOUND **";

//        if (input.snippet == undefined)
//            return "** NO URL FOUND **";

//        if (input.contentDetails.upload != undefined)
//            return '/player/#/' + input.contentDetails.upload.videoId;
//        else if (input.contentDetails.like != undefined)
//            return '/player/#/' + input.contentDetails.like.resourceId.videoId;
//        else if (input.contentDetails.playlistItem != undefined)
//            return '/player/#/playlist/' + input.contentDetails.playlistItem.playlistId;
//        else if (input.snippet.type != undefined)
//            return input.snippet.type;
//        else
//            return "** NO URL FOUND **";
//    };
//});

fil.filter('date', function () {
    return function (input) {
        return new Date(input).toLocaleString();
    };
});

fil.filter('owner', function () {
    return function (input) {
        if (input.indexOf('PL') == 0)
            return 'me';
        else
            return 'yt';
    };
});
