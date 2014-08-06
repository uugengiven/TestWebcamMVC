function PostBlob(blob, fileType, fileName) {
    // FormData
    var formData = new FormData();
    formData.append(fileType + '-filename', fileName);
    formData.append(fileType + '-blob', blob);

    // progress-bar
    var hr = document.createElement('hr');
    container.appendChild(hr);
    var strong = document.createElement('strong');
    strong.innerHTML = fileType + ' upload progress: ';
    container.appendChild(strong);
    var progress = document.createElement('progress');
    container.appendChild(progress);

    // POST the Blob
    xhr('/RecordRTC/PostRecordedAudioVideo', formData, progress, function (fName) {
        container.appendChild(document.createElement('hr'));
        var mediaElement = document.createElement(fileType);

        var source = document.createElement('source');
        source.src = location.href + 'uploads/' + fName.replace(/"/g, '');

        if (fileType == 'video') source.type = 'video/webm; codecs="vp8, vorbis"';
        if (fileType == 'audio') source.type = 'audio/wav';

        mediaElement.appendChild(source);

        mediaElement.controls = true;
        container.appendChild(mediaElement);
        mediaElement.play();

        progress.parentNode.removeChild(progress);
        strong.parentNode.removeChild(strong);
        hr.parentNode.removeChild(hr);
    });
}

/*
    //var record = document.getElementById('record');
    var record = $("#record");
    var stop = $("#stop");
    var deleteFiles = $("#delete");
    //var stop = document.getElementById('stop');
    //var deleteFiles = document.getElementById('delete');

    var audio = document.querySelector('audio');

    var recordVideo = document.getElementById('record-video');
    var preview = document.getElementById('preview');

    var container = document.getElementById('container');

    var recordAudio, recordVideo;
*/
function recordClick() {
    // ugly var block because I need to clear his ugly ass globals, wtf, who wrote this shit?
    var record = $("#record");
    var stop = $("#stop");
    var deleteFiles = $("#delete");
    var audio = document.querySelector('audio');
    var recordVideo = document.getElementById('record-video');
    var preview = document.getElementById('preview');
    var container = document.getElementById('container');
    var recordAudio, recordVideo;

    record.disabled = true;
    var video_constraints = {
        mandatory: {},
        optional: []
    };
    navigator.getUserMedia({
        audio: true,
        video: video_constraints
    }, function (stream) {
        preview.src = window.URL.createObjectURL(stream);
        preview.play();

        // var legalBufferValues = [256, 512, 1024, 2048, 4096, 8192, 16384];
        // sample-rates in at least the range 22050 to 96000.
        recordAudio = RecordRTC(stream, {
            // bufferSize: 16384,
            // sampleRate: 45000
        });

        recordVideo = RecordRTC(stream, {
            type: 'video'
        });

        recordAudio.startRecording();
        recordVideo.startRecording();

        stop.disabled = false;
    });
}

function stopClick(){ 
    // ugly var block because I need to clear his ugly ass globals, wtf, who wrote this shit?
    var record = $("#record");
    var stop = $("#stop");
    var deleteFiles = $("#delete");
    var audio = document.querySelector('audio');
    var recordVideo = document.getElementById('record-video');
    var preview = document.getElementById('preview');
    var container = document.getElementById('container');
    var recordAudio, recordVideo;

    var fileName;
    record.disabled = false;
    stop.disabled = true;

    fileName = Math.round(Math.random() * 99999999) + 99999999;

    recordAudio.stopRecording();
    PostBlob(recordAudio.getBlob(), 'audio', fileName + '.wav');

    recordVideo.stopRecording();
    PostBlob(recordVideo.getBlob(), 'video', fileName + '.webm');

    preview.src = '';
    deleteFiles.disabled = false;
}

function deleteClick() {
    deleteAudioVideoFiles();
}


function deleteAudioVideoFiles() {
    deleteFiles.disabled = true;
    if (!fileName) return;
    var formData = new FormData();
    formData.append('delete-file', fileName);
    xhr('/RecordRTC/DeleteFile', formData, null, function (response) {
        console.log(response);
    });
    fileName = null;
    container.innerHTML = '';
}

function xhr(url, data, progress, callback) {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (request.readyState == 4 && request.status == 200) {
            callback(request.responseText);
        }
    };

    request.onprogress = function (e) {
        if (!progress) return;
        if (e.lengthComputable) {
            progress.value = (e.loaded / e.total) * 100;
            progress.textContent = progress.value; // Fallback for unsupported browsers.
        }

        if (progress.value == 100) {
            progress.value = 0;
        }
    };
    request.open('POST', url);
    request.send(data);
}

window.onbeforeunload = function () {
    if (!!fileName) {
        deleteAudioVideoFiles();
        return 'It seems that you\'ve not deleted audio/video files from the server.';
    }
};