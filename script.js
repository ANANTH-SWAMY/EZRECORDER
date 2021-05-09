let shouldStop = false;
let stopped = false;
const videoElement = document.getElementsByTagName("video")[0];
const downloadLink = document.getElementById('download');
const stopButton = document.getElementById('stop');

function startRecord() {
    $('.btn-info').prop('disabled', true);
    $('#stop').prop('disabled', false);
    //$('#download').css('display', 'none')
    $('#download').prop('disabled',true)
    $('#DOWNLOAD').prop('disabled',true)
}
function stopRecord() {
    $('.btn-info').prop('disabled', false);
    $('#stop').prop('disabled', true);
    //$('#download').css('display', 'block')
    $('#download').prop('disabled',false)
    $('#DOWNLOAD').prop('disabled',false)
}
const audioRecordConstraints = {
    echoCancellation: true
}

stopButton.addEventListener('click', function () {
    shouldStop = true;
});

const handleRecord = function ({stream, mimeType}) {
    startRecord()
    let recordedChunks = [];
    stopped = false;
    const mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = function (e) {
        if (e.data.size > 0) {
            recordedChunks.push(e.data);
        }

        if (shouldStop === true && stopped === false) {
            mediaRecorder.stop();
            stopped = true;
        }
    };

    mediaRecorder.onstop = function () {
        const blob = new Blob(recordedChunks, {
            type: mimeType
        });
        recordedChunks = []
        downloadLink.href = URL.createObjectURL(blob);
        downloadLink.download = `video.webm`;
        stopRecord();
        videoElement.srcObject = null;
    };

    mediaRecorder.start(200);
};



async function recordScreen() {
    const mimeType = 'video/webm';
    shouldStop = false;
    const constraints = {
        video: {
            cursor: 'motion'
        }
    };
    if(!(navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia)) {
        return window.alert('Screen Record not supported!')
    }
    let stream = null;
    const displayStream = await navigator.mediaDevices.getDisplayMedia({video: {cursor: "motion"}, audio: {'echoCancellation': true}});
    stream = displayStream;
    handleRecord({stream, mimeType});
    videoElement.srcObject = stream;
}