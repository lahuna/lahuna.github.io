//*****************************************************************************************************************
// Copyright © 2014 - 2015 Lahuna. All rights reserved.
// You may not copy, reproduce, republish, disassemble, decompile, reverse engineer, post, broadcast, transmit, or
// make available to the public any content or code on this website without prior written permission from Lahuna.
//*****************************************************************************************************************

var photoBinary;
var photoCount = 0; // total number of photos (display purposes only)
var photoNum = 0; // current photo being uploaded (display purposes only)
var fileNum = -1; // used for indexing files 0 to fileCount
var fileCount = 0; // total number of files
var successPhotoCount = 0; 
var fileList = undefined;
var file = undefined;
var pause = false;
var cancel = false;
var albumId = "";
var userId = "";
var jobId = undefined;
var jobItemId = undefined;
var accessToken = "";
var refreshToken = "";
var fileName = "";
var fileNamePath = "";
var logJobAttempt = 1;
var logJobItemAttempt = 1;
var uploadAttempt = 1;
var statusMessage = "";

function HandleFileSelect(evt) {
    try
    {
        if (!TokensPresent())
            return;

        accessToken = localStorage.getItem("LahunaGoogleAccessToken");
        refreshToken = localStorage.getItem("LahunaGoogleRefreshToken");

        fileList = evt.target.files;
        fileCount = fileList.length;
        if (fileCount == 0)
            return;

        $("#divButtons").show();
        DisableForAction();

        $("#divStatus").html("<p>Analyzing files...</p>");

        // initial loop to find total number of photos
        for (var i = 0; i < fileCount; i++) {
            if (fileList[i].type.indexOf("image") > -1)
                photoCount++
        }

        $("#divStatus").html("<p>Starting upload...</p>");
        $("#divPhotos").html("<p>Photos Found: " + photoCount + ".</p>");

        LogJob("Upload Photos: " + photoCount, "Start", accessToken, refreshToken);
    }
    catch (error) {
        HandleErrorJob(error.message, "HandleFileSelect", jobId, jobItemId, true);
    }
};

function GetAlbumId(albumTitle) {
    try {

        $.ajax({
            type: 'GET',
            url: "todo/picasa/get-album-id?albumTitle=" + albumTitle,
            headers: { "AccessToken": accessToken, "RefreshToken": refreshToken },
            error: function (xhr, status, error) { FailGetAlbumId(xhr.responseText) }
        }).then(
        function (data, status) {
            albumId = data;
            CheckForNext();
        });
    }
    catch (error) {
        HandleErrorJob(error.message, "GetAlbumId", jobId, jobItemId, true);
        throw new Error(error.message);
    }
};

function CheckForNext() {
    try {
        if (((fileNum + 1) == fileCount) || cancel) {
            Completed("Done"); // all done
            return;
        } else if (pause) {
            Completed("Paused"); // paused
            return;
        }

        fileNum++;
        file = fileList[fileNum];
        SetFile();
        if (file.type.indexOf("image") > -1) {
            photoNum++;
            StartUpload(); // if an image, start upload
        }
        else
            CheckForNext(); // if not an image, loop back
    }
    catch (error) {
        HandleErrorJob(error.message, "CheckForNext", jobId, jobItemId, true);
        throw new Error(error.message);
    }
};

function SetFile() {
    try {
        fileName = file.name.replace(/[^a-zA-Z0-9-_./\() ]/g, '-');

        if (file.webkitRelativePath == "" || file.webkitRelativePath == undefined)
            fileNamePath = fileName;
        else
            fileNamePath = file.webkitRelativePath.replace(/[^a-zA-Z0-9-_./\() ]/g, '-');
    }
    catch (error) {
        HandleErrorJob(error.message, "SetFile", jobId, jobItemId, true);
        throw new Error(error.message);
    }
};

function StartUpload() {
    try {
        
        var message = "Uploading photo " + photoNum + " of " + photoCount + ".";
        $("#divStatus").html("<p>" + message + "</p>");
        LogJobItem(jobId, fileNamePath, message);
    }
    catch (error) {
        HandleErrorJob(error.message, "StartUpload", jobId, jobItemId, true);
        throw new Error(error.message);
    }
};

function ReadBinary() {
    try {
        var reader = new FileReader();

        reader.onload = (function (e) {
            photoBinary = e.target.result;
            UploadPhoto();
        });

        reader.readAsDataURL(file);
    }
    catch (error) {
        HandleErrorJob(error.message, "ReadBinary", jobId, jobItemId, true);
        throw new Error(error.message);
    }
}

function UploadPhoto() {
    try {

        var urlString = "todo/picasa/upload-photo?" +
            "albumId=" + albumId + "&" +
            "jobId=" + jobId + "&" +
            "jobItemId=" + jobItemId;

        $.ajax({
            type: "POST",
            url: urlString,
            headers: {
                "AccessToken": accessToken,
                "RefreshToken": refreshToken,
                "FileName": fileName
            },
            contentType: file.type,
            data: photoBinary,
            timeout: 300000, // 5 minutes
            error: function (xhr, status, error) { FailUpload(xhr.responseText) }
        }).then(
            function (data, status) {
                SuccessUpload(data);
            });
    }
    catch (error) {
        HandleErrorJob(error.message, "UploadPhoto", jobId, jobItemId, false);
        FailUpload(error.message);
    }
};

function SuccessUpload(data) {
    try {
        // success
        if (data != undefined && data.accessToken != undefined) {
            uploadAttempt = 1;
            accessToken = data.accessToken;
            successPhotoCount++;
            var message = "Uploaded photo " + photoNum + " of " + photoCount + ".";
            LogJobItemUpdate(jobItemId, message, true);
            CheckForNext();
            return;
        }

        // fail
        if (uploadAttempt < 3) {
            uploadAttempt++;
            UploadPhoto();
        } else {
            uploadAttempt = 1;
            CheckForNext();
        }
    }
    catch (error) {
        HandleErrorJob(error.message, "SuccessUpload", jobId, jobItemId, true);
    }
};

function FailGetAlbumId(errorMessage) {

    HandleErrorJob(errorMessage, "FailGetAlbumId", jobId, jobItemId, true);
};

function FailUpload(errorMessage) {
    try {

        HandleErrorJob(errorMessage, "FailUpload", jobId, jobItemId, false);

        if (uploadAttempt < 3) {
            uploadAttempt++;
            UploadPhoto();
        } else {
            uploadAttempt = 1;
            CheckForNext();
        }
    }
    catch (error) {
        HandleErrorJob(error.message, "FailUpload", jobId, jobItemId, true);
    }
};

function Pause() {
    try {
        if ($("#buttonPause").html() == "Pause") {
            pause = true;
            $("#buttonPause").html("Resume");
            Completed("Paused");
            //$("#divStatus").html("<p>Pausing upload...</p>");
        } else {
            pause = false;
            $("#divMessage").html("");
            $("#buttonPause").html("Pause");
            $("#divStatus").html("<p>Resuming upload...</p>");
            CheckForNext();
        }
    }
    catch (error) {
        HandleErrorJob(error.message, "Pause", jobId, jobItemId, true);
        throw new Error(error.message);
    }
};

function Cancel() {
    try {
        cancel = true;
        Completed("Done");
        //if (pause)
        //    Completed("Done");
        //else
            //$("#divStatus").html("<p>Cancelling upload...</p>");
    }
    catch (error) {
        HandleErrorJob(error.message, "Cancel", jobId, jobItemId, true);
        throw new Error(error.message);
    }
};

function Completed(message) {
    try {
        statusMessage = "Uploaded " + successPhotoCount + " out of " + photoCount + " photos.";

        $("#divMessage").html("<p>" + message + ".</p>");
        //$("#divPhotos").html("");
        $("#divStatus").html("<p>" + statusMessage + "</p>");

        if (!pause || cancel) {
            EnableAfterAction();
            $("#divButtons").hide();
        }

        if (!pause && jobId != -1)
            LogJobUpdate(jobId, statusMessage, true);
            //GetJobStatus(jobId);
    }
    catch (error) {
        HandleErrorJob(error.message, "Completed", jobId, jobItemId, true);
        throw new Error(error.message);
    }
};

function DisableForAction() {
    try {
        $("#buttonLogin").prop("disabled", true);
        document.getElementById("inputFiles").disabled = true;
    }
    catch (error) {
        HandleErrorJob(error.message, "DisableForAction", jobId, jobItemId, true);
        throw new Error(error.message);
    }
};

function EnableAfterAction() {
    try {
        $("#buttonLogin").prop("disabled", false);
        document.getElementById("inputFiles").disabled = false;
        HidePreloader();
    }
    catch (error) {
        HandleErrorJob(error.message, "EnableAfterAction", jobId, jobItemId, true);
        throw new Error(error.message);
    }
};

function ResetPage(type) {
    try {

        photoBinary = undefined;
        photoCount = 0;
        photoNum = 0;
        fileNum = -1;
        fileCount = 0;
        successPhotoCount = 0;

        fileList = undefined;
        file = undefined;
        pause = false;
        cancel = false;

        albumId = "";
        userId = "";
        jobId = undefined;
        jobItemId = undefined;
        accessToken = "";
        refreshToken = "";
        fileName = "";
        fileNamePath = "";
        logJobAttempt = 1;
        logJobItemAttempt = 1;
        uploadAttempt = 1;
        statusMessage = "";

        $("#buttonPause").html("Pause");
        $("#inputFiles").val("");
        $("#divMessage").html("");
        $("#divPhotos").html("");
        $("#divVideos").html("");
        $("#divStatus").html("");
        $("#divButtons").hide();

        if (type == "logout")
            document.getElementById("inputFiles").disabled = true;
    }
    catch (error) {
        HandleErrorJob(error.message, "ResetPage", jobId, jobItemId, true);
        throw new Error(error.message);
    }    
};

function SuccessLogJob(data) {
    try {
        if (data.errorMessage != undefined && logJobAttempt < 3) {
            logJobAttempt++;
            LogJob("Upload Photos: " + photoCount, "Start", accessToken, refreshToken);
            return;
        }

        logJobAttempt = 1;
        jobId = data.jobId;
        userId = data.userId;
        accessToken = data.accessToken;
        GetAlbumId("Auto Backup");
    }
    catch (error) {
        HandleErrorJob(error.message, "SuccessLogJob", jobId, jobItemId, true);
    }
};

function SuccessLogJobItem(data) {
    try {
        if (data.jobItemId == -1) { // cancelled by status page
            jobId = -1;
            jobItemId = -1;
            Cancel();
            return;
        }

        if (data.errorMessage != undefined && logJobItemAttempt < 3) {
            logJobItemAttempt++;
            StartUpload();
            return;
        }

        logJobItemAttempt = 1;
        if (data.done) { // already completed, so skip
            successPhotoCount++;
            CheckForNext();
        } else {
            jobItemId = data.jobItemId;
            ReadBinary();
        }
    }
    catch (error) {
        HandleErrorJob(error.message, "SuccessLogJobItem", jobId, jobItemId, true);
    }
};

$(function () {
    document.getElementById("inputFiles").addEventListener("change", HandleFileSelect, false);
});