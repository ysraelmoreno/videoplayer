let videoTravis = document.getElementById('videoTravis');
let timeVideo = document.getElementById('timevideo');
let volumeController = document.getElementById('volumeController');

let buttons = document.getElementById('buttons');
let muteVolume = document.getElementById('muteVolume');
let playButton = document.getElementById('playButton');

let speedController = document.getElementById('speedController')
let textVideoDuration = document.getElementById('textVideoDuration')
let textVideoCurrentDuration = document.getElementById('textVideoCurrentDuration')

function displayButtons() {
    buttons.className = 'showing';
}

function stopDisplayButtons(ev) {
    buttons.className = 'hidden';
}

async function autoplay() {
    if (localStorage.getItem('videoLastMinute')) {
        videoTravis.className = "autoplayed";
        await play();
    }
}

async function play() {
    if (playButton.className == "paused" && videoTravis.className == "paused" || videoTravis.className == "autoplayed") {
        await videoTravis.play();
        videoTravis.className = "playing";

        playButton.className = "playing";
        playButton.innerHTML = `<i class="fas fa-pause"></i>`
    } else {
        videoTravis.pause();
        videoTravis.className = "paused";

        playButton.className = "paused";
        playButton.innerHTML = `<i class="fas fa-play"></i>`
    }
}

let lastVolume;

function mute() {
    if(muteVolume.className == "unmuted") {
        lastVolume = videoTravis.volume;
        videoTravis.volume = 0;

        muteVolume.className = "muted";
        muteVolume.innerHTML = `<i class="fas fa-volume-mute"></i>`;
    } else {
        videoTravis.volume = lastVolume;

        muteVolume.innerHTML = `<i class="fas fa-volume-up"></i>`;
        muteVolume.className = "unmuted"
    }
}

function setDurationByMouse(event) {
    let divInitialWidth = timeVideo.getBoundingClientRect().x
    let divWidth = timeVideo.getBoundingClientRect().width

    let videoTimeMouse = ((event.clientX - divInitialWidth) * 100) / divWidth;
    let videoTimeDuration = (videoTravis.duration * videoTimeMouse) / 100;
    videoTravis.currentTime = videoTimeDuration;
}

function setVolumeByMouse(event) {
    let divInitialWidth = volumeController.getBoundingClientRect().x
    let divWidth = volumeController.getBoundingClientRect().width

    let videoVolume = (event.clientX - divInitialWidth) / divWidth;
    let videoFinalVolume = (videoTravis.duration * videoVolume) / 100;
    console.log(videoFinalVolume)
    videoTravis.volume = videoFinalVolume;
}

function stop() {
    if (videoTravis.className === "playing") {
        videoTravis.pause();
        videoTravis.currentTime = 0;
        videoTravis.play();
    } else {
        videoTravis.pause();
        videoTravis.currentTime = 0;
    }
}

function increaseSpeed() {
    videoTravis.playbackRate += 0.10;
}

function increaseVolume() {
    videoTravis.volume += 0.1
    localStorage.setItem('lastVolumeVideo', videoTravis.volume);

}

function decreaseVolume() {
    videoTravis.volume -= 0.1
    localStorage.setItem('lastVolumeVideo', videoTravis.volume);

}

function decreaseSpeed() {
    videoTravis.playbackRate -= 0.10;
}

function backTenSeconds() {
    videoTravis.currentTime -= 10;
}

function advanceTenSeconds() {
    videoTravis.currentTime += 10;
}

function updateTextDuration() {
    textVideoDuration.innerHTML = "&nbsp;" + new Date(videoTravis.duration * 1000).toISOString().substr(11, 8).slice(3)
}

async function updateTextCurrentDuration() {
    textVideoCurrentDuration.innerHTML =  new Date(videoTravis.currentTime * 1000).toISOString().substr(11, 8).slice(3) + "&nbsp;/ ";
}


function updateBarWidth() {
    const videoDuration = videoTravis.duration;
    const videoCurrentDuration = videoTravis.currentTime;

    const videoDurationUpdated = (videoCurrentDuration * 100) / videoDuration;
    barVideo.style.width =videoDurationUpdated + "%";
}

function updateBarVolumeWidth() {
    const currentVolume = videoTravis.volume;
    const updatedVolume = currentVolume * 100;

    barVolume.style.width = updatedVolume + "%";
}

function fullscreen() {
    videoTravis.webkitRequestFullScreen();
}

let barVideo = document.createElement("div");

barVideo.style.height = "100%";
barVideo.style.width = "0";
barVideo.style.backgroundColor = "red";

timeVideo.append(barVideo);

let barVolume = document.createElement("div");

barVolume.style.height = "100%";
barVolume.style.width = "0";
barVolume.style.backgroundColor = "red";
barVolume.style.transition = "all 0.2s ease";
volumeController.append(barVolume)

updateBarVolumeWidth();

let lastVolumeCached = localStorage.getItem('lastVolumeVideo');

if (!lastVolumeCached) {
    videoTravis.volume = 1;
} else {
    videoTravis.volume = lastVolumeCached;
}

textVideoDuration.innerHTML === "&nbsp;NaN" ? textVideoDuration.innerHTML = "&nbsp;" + "0:00" : textVideoDuration.innerHTML = "&nbsp;" + "0:00"

videoTravis.currentTime = localStorage.getItem('videoLastMinute');

videoTravis.addEventListener('mouseover', displayButtons);
videoTravis.addEventListener('mouseleave', stopDisplayButtons)

videoTravis.addEventListener('timeupdate', async function(ev) {
    if(textVideoCurrentDuration.innerHTML === "&nbsp;NaN") {
        textVideoCurrentDuration.innerHTML = "0:00"
        updateTextDuration();
    }
    updateTextDuration();
    updateTextCurrentDuration();
    updateBarWidth();

    localStorage.setItem('videoLastMinute', videoTravis.currentTime)
})

videoTravis.addEventListener("click", play);

videoTravis.addEventListener("dblclick", function(ev) {
    if (ev.clientX > 1080) {
        advanceTenSeconds()
    } else if (ev.clientX >= 800 && ev.clientX < 1080) {
        videoTravis.webkitRequestFullScreen();
    } else {
        backTenSeconds()
    }
})

volumeController.addEventListener('click', setVolumeByMouse)

buttons.addEventListener('mouseover', displayButtons);
buttons.addEventListener('mouseleave', stopDisplayButtons)

timeVideo.addEventListener('click', setDurationByMouse)

timeVideo.addEventListener('mouseover', function() {
    timeVideo.style.height = "10px";
})

timeVideo.addEventListener('mouseleave', function() {
    timeVideo.style.height = "5px";
})

timeVideo.addEventListener('change', function(ev) {
    videoTravis.currentTime = ev.target.value;
})

videoTravis.addEventListener('volumechange', function() {
    updateBarVolumeWidth();
})

const stateCommands = {
    " ": "play()",
    "ArrowUp": "increaseVolume()",
    "ArrowDown": "decreaseVolume()",
    "ArrowRight": "advanceTenSeconds()",
    "ArrowLeft": "backTenSeconds()",
    "m": "mute()",
    "f": "fullscreen()"
}

window.addEventListener('keydown', (ev) => {
    Object.keys(stateCommands).forEach(key => {
        if(ev.key == key) {
            eval(stateCommands[key]);
        }
    })
})

volumeController.addEventListener('change', function(ev) {
    var value = ev.target.value / 100;

    videoTravis.volume = value;
})

volumeController.addEventListener('mouseover', function() {
    volumeController.style.visibility = "visible";
    volumeController.style.width = "50%"
})

volumeController.addEventListener('mouseleave', function() {
    volumeController.style.visibility = "hidden";
    volumeController.style.width = "0"
})


muteVolume.addEventListener('mouseover', function() {
    volumeController.style.visibility = "visible"
    volumeController.style.width = "50%"
    volumeController.style.display = "flex";
})

muteVolume.addEventListener('mouseleave', function() {
    volumeController.style.visibility = "hidden";
    volumeController.style.width = "0"
})


speedController.addEventListener('change', function(ev) {
    videoTravis.playbackRate = ev.target.value;
    console.log(videoTravis.getBoundingClientRect());
});

document.addEventListener('DOMContentLoaded', async function() {
    setTimeout(autoplay, 1000)
})
