//*****************************************************************************************************************
// Copyright 2014-2018 Lahuna. All rights reserved.
// You may not copy, reproduce, republish, disassemble, decompile, reverse engineer, post, broadcast, transmit, or
// make available to the public any content or code on this website without prior written permission from Lahuna.
//*****************************************************************************************************************

'use strict';

var fac = angular.module('PhotoFactory', ['ResourceFactory', 'AuthenticateFactory']);

fac.factory('Photo', function (PicasaAlbumFeedResource,
  PicasaResource, PicasaPhotoResource, PhotoDbResource, Auth) {

  return { 'Rotate': Rotate,
           'GetPhoto': GetPhoto };

  function GetAccessToken() {
   return localStorage.getItem('google_access_token');
  }

  function Rotate(photoItem, value, callback) {

    var xml =
      "<entry xmlns=\'http://www.w3.org/2005/Atom\' " +
        "xmlns:media=\'http://search.yahoo.com/mrss/\' " +
        "xmlns:gphoto=\'http://schemas.google.com/photos/2007\' " +
        "xmlns:gml='http://www.opengis.net/gml\' " +
        "xmlns:georss=\'http://www.georss.org/georss\'>" +
        "<gphoto:rotation>" + value + "</gphoto:rotation>" +
        "<category scheme=\'http://schemas.google.com/g/2005#kind\' " +
        "term=\'http://schemas.google.com/photos/2007#album\'></category>" +
      "</entry>";

    if (photoItem.gphoto$id)
      photoItem.photoId = photoItem.gphoto$id.$t;

    PicasaPhotoResource(photoItem.photoId).Patch({
      xml: xml,
      accessToken: GetAccessToken()
    }).$promise.then(function (data) {
        photoItem.thumbnail = data.entry.media$group.media$thumbnail[0].url;
        callback(photoItem);
        photoItem.accessToken = GetAccessToken();        
        PhotoDbResource.Put(photoItem);
    });
  }

  function GetPhoto(input, callback) {
    PicasaPhotoResource(input.photoId).Get({
      'accessToken': GetAccessToken()
    }).$promise.then(function (data) {
      var result = {
        'photo': data.entry
      }

      if (input.albumId) {
        GetAlbumPhotos(input, function (list) {
          result.list = list;
          return callback(result);
        });
      } //else if (input.tag) {
        else if (input.startIndex) {
        GetSearchPhotos(input, function (list) {
          result.list = list;
          return callback(result);
        });
      } else {
        return callback(result); // no list needed
      }
    });
  }

  function GetAlbumPhotos(input, callback) {
    PicasaAlbumFeedResource(input.albumId).Get({
      'kind': 'photo',
      'start-index': input.startIndex,
      'max-results': input.maxResults,
      //'alt': 'json',
      'accessToken': GetAccessToken()
      }).$promise.then(function (data) {
        callback(data);
      });
  }

  function GetSearchPhotos(input, callback) {
    PicasaResource.Get({
      'kind': 'photo',
      'q': input.tag,
      'start-index': input.startIndex,
      'max-results': input.maxResults,
      //'alt': 'json',
      'accessToken': GetAccessToken()
    }).$promise.then(function (data) {
      callback(data);
    });
  }
});
