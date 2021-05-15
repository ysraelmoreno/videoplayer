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
    } else {
        videoTravis.volume = lastVolume;

        muteVolume.className = "unmuted"
    }
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
    let videoDurationMin = videoTravis.duration / 60;
    let videoDurationMinFixed = videoDurationMin.toFixed(2);
    textVideoDuration.innerHTML = "&nbsp;" + videoDurationMinFixed.replace('.', ':');
}

async function updateTextCurrentDuration() {
    let videoDurationMin = await videoTravis.currentTime / 60;
    let videoDurationMinFixed = videoDurationMin.toFixed(2);
    textVideoCurrentDuration.innerHTML = videoDurationMinFixed.replace('.', ':') + "&nbsp;/ ";
}

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
    if (ev.clientX > 800) {
        advanceTenSeconds()
    } else if (ev.clientX >= 500 && ev.clientX < 800) {
        videoTravis.webkitRequestFullScreen();
    } else {
        backTenSeconds()
    }
})

buttons.addEventListener('mouseover', displayButtons);
buttons.addEventListener('mouseleave', stopDisplayButtons)

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

window.addEventListener('keydown', (ev) => {
    if(ev.keyCode == 32) {
        play()
    }

    if (ev.key === "ArrowUp") {
        increaseVolume()
    }

    if (ev.key === "ArrowDown") {
        decreaseVolume()
    }

    if (ev.key === "ArrowRight") {
        advanceTenSeconds()
    }

    if (ev.key === "ArrowLeft") {
        backTenSeconds()
    }

    if(ev.key === "m") {
        mute()
    }

    if(ev.key === "f") {
        videoTravis.webkitRequestFullScreen();
    }
})

window.addEventListener('load', function() {

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
});

updateBarVolumeWidth();

let lastVolumeCached = localStorage.getItem('lastVolumeVideo');

if (!lastVolumeCached) {
    videoTravis.volume = 1;
} else {
    videoTravis.volume = lastVolumeCached;
}

textVideoDuration.innerHTML === "&nbsp;NaN" ? textVideoDuration.innerHTML = "&nbsp;" + "0:00" : textVideoDuration.innerHTML = "&nbsp;" + "0:00"

videoTravis.currentTime = localStorage.getItem('videoLastMinute');

document.addEventListener('DOMContentLoaded', async function() {
    setTimeout(autoplay, 1000)
})
