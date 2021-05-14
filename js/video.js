let videoTravis = document.getElementById('videoTravis');
let buttons = document.getElementById('buttons');
let muteVolume = document.getElementById('muteVolume');
let timeVideo = document.getElementById('timevideo');
let volumeController = document.getElementById('volumeController');
let playButton = document.getElementById('playButton');
let speedController = document.getElementById('speedController')

function displayButtons() {
    buttons.className = 'showing';
}

function stopDisplayButtons(ev) {
    buttons.className = 'hidden';
}

function play() {
    if (playButton.className == "paused" && videoTravis.className == "paused") {
        videoTravis.play();
        videoTravis.className = "playing";
        playButton.className = "playing";
        playButton.innerHTML = `<i class="fas fa-pause"></i>`
    } else {
        videoTravis.pause();
        playButton.className = "paused";
        videoTravis.className = "paused";
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
    videoTravis.pause();
    videoTravis.currentTime = 0;

    if (playButton.className == "playing") {
        play();
    }
}

function increaseSpeed() {
    videoTravis.playbackRate += 0.10;
}

function increaseVolume() {
    videoTravis.volume += 0.1
}

function decreaseVolume() {
    videoTravis.volume -= 0.1
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

videoTravis.addEventListener('mouseover', displayButtons);
videoTravis.addEventListener('mouseleave', stopDisplayButtons)

videoTravis.addEventListener('timeupdate', function(ev) {
    timeVideo.value = ev.target.currentTime;
    updateBarWidth();
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
    console.log ()

})

buttons.addEventListener('mouseover', displayButtons);
buttons.addEventListener('mouseleave', stopDisplayButtons)

let barVideo = document.createElement("div");

barVideo.style.height = "100%";
barVideo.style.width = "0";
barVideo.style.backgroundColor = "red";

timeVideo.append(barVideo);

function updateBarWidth() {
    const videoDuration = videoTravis.duration;
    const videoCurrentDuration = videoTravis.currentTime;

    const videoDurationUpdated = (videoCurrentDuration * 100) / videoDuration;

    barVideo.style.width =videoDurationUpdated + "%";
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

window.addEventListener('keydown', (ev) => {
    ev.preventDefault;
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
    console.log(ev.key)
})

volumeController.addEventListener('change', function(ev) {
    var value = ev.target.value / 100;

    videoTravis.volume = value;
})

volumeController.addEventListener('mouseover', function() {
    volumeController.style.marginTop = "-15px"
    volumeController.style.display = "flex";
})

volumeController.addEventListener('mouseleave', function() {
    volumeController.style.display = "none";
})


muteVolume.addEventListener('mouseover', function() {
    volumeController.style.marginTop = "-15px"

    volumeController.style.display = "flex";
})

muteVolume.addEventListener('mouseleave', function() {
    volumeController.style.marginTop = "-15px"

    volumeController.style.display = "none";
})


speedController.addEventListener('change', function(ev) {
    videoTravis.playbackRate = ev.target.value;
});
