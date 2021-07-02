let videoTravis = document.getElementById("videoTravis");
let timeVideo = document.getElementById("timevideo");
let videoTimer = document.getElementById("video-timer");
let volumeController = document.getElementById("volumeController");

let buttons = document.getElementById("buttons");
let muteVolume = document.getElementById("muteVolume");
let playButton = document.getElementById("playButton");

let speedController = document.getElementById("speedController");
let textVideoDuration = document.getElementById("textVideoDuration");
let textVideoCurrentDuration = document.getElementById(
  "textVideoCurrentDuration"
);

let cache = {};

function setComponentClassname(component, name) {
  component.className = name;
}

function theatermode() {
  videoTravis.id = "videoTravis-theater-mode";
  buttons.id = "buttons-theater-mode";
  timeVideo.id = "timevideo-theater-mode";
  videoTimer.id = "video-timer-theater-mode";
}

function setCache(variable) {
  Object.keys(variable).forEach((key) => {
    localStorage.setItem(key, variable[key]);
  });
}

function getComponentClassname(component) {
  return component.className;
}

function getVideoDuration() {
  return videoTravis.duration;
}

function setVideoVolume(volume) {
  videoTravis.volume = volume;

  let videoVolume = {
    lastVolumeVideo: videoTravis.volume,
  };

  Object.assign(cache, videoVolume);
}

function getVideoVolume() {
  return videoTravis.volume;
}

function setVideoCurrentTime(duration) {
  videoTravis.currentTime = duration;
}

function getVideoCurrentDuration() {
  return videoTravis.currentTime;
}

function displayButtons() {
  setComponentClassname(buttons, "showing");
}

function stopDisplayButtons() {
  setComponentClassname(buttons, "hidden");
}

async function autoplay() {
  if (localStorage.getItem("videoLastMinute")) {
    setComponentClassname(videoTravis, "autoplayed");
    await play();
  }
}

async function play() {
  if (
    (playButton.className == "paused" && videoTravis.className == "paused") ||
    videoTravis.className == "autoplayed"
  ) {
    await videoTravis.play();
    setComponentClassname(videoTravis, "playing");
    setComponentClassname(playButton, "playing");

    playButton.innerHTML = `<i class="fas fa-pause"></i>`;
  } else {
    videoTravis.pause();
    setComponentClassname(videoTravis, "paused");
    setComponentClassname(playButton, "paused");

    playButton.innerHTML = `<i class="fas fa-play"></i>`;
  }
}

let lastVolume;

function mute() {
  if (getComponentClassname(muteVolume) == "unmuted") {
    lastVolume = getVideoVolume();
    setVideoVolume(0);

    setComponentClassname(muteVolume, "muted");

    muteVolume.innerHTML = `<i class="fas fa-volume-mute"></i>`;
  } else {
    setVideoVolume(lastVolume);

    muteVolume.innerHTML = `<i class="fas fa-volume-up"></i>`;
    setComponentClassname(muteVolume, "unmuted");
  }
}

function setDurationByMouse(event) {
  let divInitialWidth = timeVideo.getBoundingClientRect().x;
  let divWidth = timeVideo.getBoundingClientRect().width;

  let videoTimeMouse = ((event.clientX - divInitialWidth) * 100) / divWidth;
  let videoTimeDuration = (getVideoDuration() * videoTimeMouse) / 100;
  setVideoCurrentTime(videoTimeDuration);
}

function setVolumeByMouse(event) {
  let divInitialWidth = volumeController.getBoundingClientRect().x;
  let divWidth = volumeController.getBoundingClientRect().width;

  let videoVolume = (event.clientX - divInitialWidth) / divWidth;
  setVideoVolume(videoVolume);
}

function stop() {
  if (getComponentClassname(videoTravis) === "playing") {
    videoTravis.pause();
    setVideoCurrentTime(0);
    videoTravis.play();
  } else {
    videoTravis.pause();
    setVideoCurrentTime(0);
  }
}

function increaseSpeed() {
  videoTravis.playbackRate += 0.1;
}

function increaseVolume() {
  videoTravis.volume += 0.1;
  let videoVolume = {
    lastVolumeVideo: videoTravis.volume,
  };

  Object.assign(cache, videoVolume);
}

function decreaseVolume() {
  videoTravis.volume -= 0.1;
  let videoVolume = {
    lastVolumeVideo: videoTravis.volume,
  };

  Object.assign(cache, videoVolume);
}

function decreaseSpeed() {
  videoTravis.playbackRate -= 0.1;
}

function backTenSeconds() {
  videoTravis.currentTime -= 10;
}

function advanceTenSeconds() {
  videoTravis.currentTime += 10;
}

function updateTextDuration() {
  textVideoDuration.innerHTML =
    "&nbsp;" +
    new Date(videoTravis.duration * 1000).toISOString().substr(11, 8).slice(3);
}

async function updateTextCurrentDuration() {
  textVideoCurrentDuration.innerHTML =
    new Date(videoTravis.currentTime * 1000)
      .toISOString()
      .substr(11, 8)
      .slice(3) + "&nbsp;/ ";
}

function alterVideoDurationByNumbers(event) {
  const regex = /[0-9]/gi;

  if (regex.test(event.key)) {
    const finalDuration = videoTravis.duration;
    const duration = event.key * 10;

    const estimatedDuration = (duration * 1000) / finalDuration;

    setVideoCurrentTime(estimatedDuration);
  }
}

function updateBarWidth() {
  const videoDuration = getVideoDuration();
  const videoCurrentDuration = getVideoCurrentDuration();

  const videoDurationUpdated = (videoCurrentDuration * 100) / videoDuration;
  barVideo.style.width = videoDurationUpdated + "%";
}

function updateBarVolumeWidth() {
  const currentVolume = getVideoVolume();
  const updatedVolume = currentVolume * 100;

  barVolume.style.width = updatedVolume + "%";
}

function fullscreen() {
  videoTravis.webkitRequestFullScreen();
}

const stateCommands = {
  " ": play,
  ArrowUp: increaseVolume,
  ArrowDown: decreaseVolume,
  ArrowRight: advanceTenSeconds,
  ArrowLeft: backTenSeconds,
  m: mute,
  f: fullscreen,
  r: stop,
};

let barVideo = document.createElement("div");

barVideo.style.height = "100%";
barVideo.style.width = "0";
barVideo.style.backgroundColor = "red";
barVideo.style.transition = "all 0.2s ease";
barVideo.style.boxShadow = "0px 0px 30px 0px red";
timeVideo.append(barVideo);

let barVolume = document.createElement("div");

barVolume.style.height = "100%";
barVolume.style.width = "0";
barVolume.style.backgroundColor = "red";
barVolume.style.transition = "all 0.2s ease";

volumeController.append(barVolume);

textVideoDuration.innerHTML === "&nbsp;NaN"
  ? (textVideoDuration.innerHTML = "&nbsp;" + "0:00")
  : (textVideoDuration.innerHTML = "&nbsp;" + "0:00");

setVideoVolume(localStorage.getItem("lastVolumeVideo")) ?? setVideoVolume(1);

setVideoCurrentTime(localStorage.getItem("videoLastMinute")) ??
  setVideoCurrentTime(0);

videoTravis.addEventListener("mouseover", displayButtons);

videoTravis.addEventListener("mouseleave", stopDisplayButtons);

videoTravis.addEventListener("timeupdate", async function (ev) {
  if (textVideoCurrentDuration.innerHTML === "&nbsp;NaN") {
    textVideoCurrentDuration.innerHTML = "0:00";
    updateTextDuration();
  }
  updateTextDuration();
  updateTextCurrentDuration();
  updateBarWidth();

  let videoCache = {
    lastVolumeVideo: videoTravis.volume,
    videoLastMinute: videoTravis.currentTime,
  };

  Object.assign(cache, videoCache);
  setCache(cache);
});

videoTravis.addEventListener("click", play);

videoTravis.addEventListener("dblclick", function (ev) {
  if (ev.clientX > 1080) {
    advanceTenSeconds();
  } else if (ev.clientX >= 800 && ev.clientX < 1080) {
    videoTravis.webkitRequestFullScreen();
  } else {
    backTenSeconds();
  }
});

volumeController.addEventListener("click", setVolumeByMouse);

buttons.addEventListener("mouseover", displayButtons);

buttons.addEventListener("mouseleave", stopDisplayButtons);

timeVideo.addEventListener("click", setDurationByMouse);

timeVideo.addEventListener("mouseover", function () {
  timeVideo.style.height = "10px";
});

timeVideo.addEventListener("mouseleave", function () {
  timeVideo.style.height = "5px";
});

timeVideo.addEventListener("change", function (ev) {
  videoTravis.currentTime = ev.target.value;
});

videoTravis.addEventListener("volumechange", function () {
  updateBarVolumeWidth();
});

window.addEventListener("keydown", (ev) => {
  alterVideoDurationByNumbers(ev);
  Object.keys(stateCommands).forEach((key) => {
    if (ev.key == key) {
      stateCommands[key]();
    }
  });
});

volumeController.addEventListener("change", function (ev) {
  var value = ev.target.value / 100;

  setVideoVolume(value);
});

volumeController.addEventListener("mouseover", function () {
  volumeController.style.visibility = "visible";
  volumeController.style.width = "50%";
});

volumeController.addEventListener("mouseleave", function () {
  volumeController.style.visibility = "hidden";
  volumeController.style.width = "0";
});

muteVolume.addEventListener("mouseover", function () {
  volumeController.style.visibility = "visible";
  volumeController.style.width = "50%";
  volumeController.style.display = "flex";
});

muteVolume.addEventListener("mouseleave", function () {
  volumeController.style.visibility = "hidden";
  volumeController.style.width = "0";
});

speedController.addEventListener("change", function (ev) {
  videoTravis.playbackRate = ev.target.value;
});

document.addEventListener("DOMContentLoaded", async function () {
  setTimeout(autoplay, 1000);
});

updateBarVolumeWidth();
