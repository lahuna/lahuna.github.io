//*****************************************************************************************************************
// Copyright � 2014 - 2015 Lahuna. All rights reserved.
// You may not copy, reproduce, republish, disassemble, decompile, reverse engineer, post, broadcast, transmit, or
// make available to the public any content or code on this website without prior written permission from Lahuna.
//*****************************************************************************************************************

'use strict';

var fac = angular.module('PhotoFactory', ['ResourceFactory', 'AuthenticateFactory']);

fac.factory('Photo', function (PicasaPhotoResource, Auth) {

  return { 'Rotate': Rotate };

  function GetAccessToken() {
   return localStorage.getItem('google_access_token');
  }

  function Rotate(photoItem, value, callback) {
    var position = "";

    if (!photoItem.position || photoItem.position.length == 0)
      if (value == 90)
        position = "rotate-right-90";
      else
        position = "rotate-left-90";

    else if (photoItem.position == "rotate-right-90")
      if (value == 90)
        position = "rotate-right-180";
      else
        position = "";

    else if (photoItem.position == "rotate-left-90")
      if (value == 90)
        position = "";
      else
        position = "rotate-left-180";

    else if (photoItem.position.indexOf("180") > 0)
      if (value == 90)
        position = "rotate-right-270";
      else
        position = "rotate-left-270";

    callback(position);

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

    PicasaPhotoResource(photoItem.gphoto$id.$t).Patch({
      xml: xml,
      accessToken: GetAccessToken()
    });
  };
});
