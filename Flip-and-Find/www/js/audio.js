document.addEventListener('DOMContentLoaded', function () {
    const bgm = document.createElement('audio');
    bgm.src = '../audio/bgm.mp3'; 

    bgm.loop = true;
    bgm.autoplay = true;
    bgm.volume = 0.5; 
    document.body.appendChild(bgm);

    document.body.addEventListener('click', function () {
        if (bgm.paused) {
            bgm.play();
        }
    });
});


// On device ready
function onDeviceReady() {
    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
    document.getElementById('deviceready').classList.add('ready');
}

// Save the state of the audio before navigating away
window.addEventListener('beforeunload', function () {
    const audio = document.getElementById('bgm');
    if (audio) {
        localStorage.setItem('bgmCurrentTime', audio.currentTime);
    }
});

// Restore the state of the audio when the page loads
window.addEventListener('load', function () {
    const audio = document.getElementById('bgm');
    if (audio) {
        const savedTime = localStorage.getItem('bgmCurrentTime');
        if (savedTime !== null) {
            audio.currentTime = savedTime;
            audio.play();
        }
    }
});
