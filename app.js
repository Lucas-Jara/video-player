const videoContainer = document.querySelector(".video-container");
const container = document.querySelector(".container");
const myVideo = document.getElementById("my-video");
const rotateContainer = document.querySelector(".rotate-container");
const videoControls = document.querySelector(".controls");
const playButton = document.getElementById("play-btn");
const pauseButton = document.getElementById("pause-btn");
const volume = document.getElementById("volume");
const volumeRange = document.getElementById("volume-range");
const volumeNum = document.getElementById("volume-num");
const high = document.getElementById("high");
const low = document.getElementById("low");
const mute = document.getElementById("mute");
const sizeScreen = document.getElementById("size-screen");
const screenCompress = document.getElementById("screen-compress");
const screenExpand = document.getElementById("screen-expand");
const currentProgess = document.getElementById("current-progress");
const currentTimerRef = document.getElementById("current-time");
const maxDuration = document.getElementById("max-duration");
const progressBar = document.getElementById("progress-bar");
const playbackSpeedButton = document.getElementById("playback-speed-btn");
const playbackContainer = document.querySelector(".playback");
const playbackSpeedOptions = document.querySelector(".playback-options");

function slider() {
  valPercent = (volumeRange.value / volumeRange.max) * 100;
  volumeRange.style.background = `linear-gradient(to right, #2887e3 ${valPercent}%, #000 ${valPercent}%)`;
}

// event object
const events = {
  mouse: {
    click: "click",
  },
  touch: {
    click: "touchstart",
  },
};

let deviceType = "";

const isTouchDevice = () => {
  try {
    document.createEvent("TouchEvent");
    deviceType = "touch";
    return true;
  } catch (e) {
    deviceType = "mouse";
    return false;
  }
};

let videoStatus = false;
let videoIsMuted = false;
let videoIsExpand = false;

// play and pause button
const playVideo = () => {
  myVideo.play();
  videoStatus = true;
  pauseButton.classList.remove("hide");
  playButton.classList.add("hide");
};

const pauseVideo = () => {
  myVideo.pause();
  videoStatus = false;
  playButton.classList.remove("hide");
  pauseButton.classList.add("hide");
};

playButton.addEventListener("click", playVideo);
pauseButton.addEventListener("click", pauseVideo);

// playback
playbackContainer.addEventListener("click", () => {
  playbackSpeedOptions.classList.remove("hide");
});

// if user clicks outside or on the options
window.addEventListener("click", (e) => {
  if (!playbackContainer.contains(e.target)) {
    playbackSpeedOptions.classList.add("hide");
  } else if (playbackSpeedOptions.contains(e.target)) {
    playbackSpeedOptions.classList.add("hide");
  }
});

// playback speed
const setPlayback = (value) => {
  playbackSpeedButton.innerText = value + "x";
  myVideo.playbackRate = value;
};

// mute video
const muter = () => {
  mute.classList.remove("hide");
  high.classList.add("hide");
  low.classList.add("hide");
  myVideo.volume = 0;
  volumeNum.innerHTML = 0;
  volumeRange.value = 0;
  volumeRange.style.background = `linear-gradient(to right, #2887e3 0%, #000 0%)`;
  slider()
};

// when user click on high and low volume then mute the audio
high.addEventListener("click", muter);
low.addEventListener("click", muter);

// for volume
volumeRange.addEventListener("input", () => {
  // for converting % to decimal values since video.volume accept decimas only
  let volumeValue = volumeRange.value / 100;
  myVideo.volume = volumeValue;
  volumeNum.innerHTML = volumeRange.value;
  // mute isSecureContext, low colume, high volume icons
  if (volumeRange.value < 50) {
    low.classList.remove("hide");
    high.classList.add("hide");
    mute.classList.add("hide");
  } else if (volumeRange.value > 50) {
    low.classList.add("hide");
    high.classList.remove("hide");
    mute.classList.add("hide");
  }
});

// screen size

const expandScreen = () => {
  videoIsExpand = false;
  screenCompress.classList.remove("hide");
  screenExpand.classList.add("hide");
  videoContainer.requestFullscreen().catch((err) => {
    alert("your device doest suport full screen API");
    if (isTouchDevice) {
      let screenOrientation =
        screen.orientation || screen.mozOrientation || screen.msOrientation;
      if (screenOrientation.type === "portrait-primary") {
        // update styling for fulscreen
        pauseVideo();
        rotateContainer.classList.remove("hide");
        setTimeout(() => {
          rotateContainer.classList.add("hide");
        }, 3000);
      }
    }
  });
};

screenExpand.addEventListener("click", expandScreen);

// if user presses escape the browser fire fullscreenchange event
document.addEventListener("fullscreenchange", exithandler);

document.addEventListener("webkitfullscreenchange", exithandler);
document.addEventListener("mozfullscreenchange", exithandler);
document.addEventListener("MSFullscreenchange", exithandler);

function exithandler() {
  // if fullscreen is closed
  if (
    !document.fullscreenElement &&
    !document.webkitIsFullScreen &&
    !document.mozFullScreen &&
    !document.msFullscreenElement
  ) {
    normalScreen();
  }
}

// back to normal screen

const normalScreen = () => {
  videoIsExpand = true;
  screenCompress.classList.add("hide");
  screenExpand.classList.remove("hide");
  if (document.fullscreenElement) {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullScreen) {
      document.webkitExitFullScreen();
    }
  }
};

screenCompress.addEventListener("click", normalScreen);
videoContainer.addEventListener("dblclick", () => {
  if (videoIsExpand) {
    expandScreen();
  } else {
    normalScreen();
  }
});

// format time
const timeFormatter = (timeInput) => {
  let minute = Math.floor(timeInput / 60);
  minute = minute < 10 ? `0${minute}` : minute;

  let second = Math.floor(timeInput % 60);
  second = second < 10 ? `0${second}` : second;

  return `${minute}:${second}`;
};

// update progress every seconds
setInterval(() => {
  currentTimerRef.innerHTML = timeFormatter(myVideo.currentTime);
  currentProgess.style.width =
    (myVideo.currentTime / myVideo.duration.toFixed(3)) * 100 + "%";
}, 1000);

myVideo.addEventListener("timeupdate", () => {
  currentTimerRef.innerText = timeFormatter(myVideo.currentTime);
});

myVideo.addEventListener("click", () => {
  if (videoStatus) {
    pauseVideo();
  } else {
    playVideo();
  }
});

// if user click on progress bar
isTouchDevice();
progressBar.addEventListener("click", (event) => {
  // start of progressbar
  let coodStart = progressBar.getBoundingClientRect().left;

  // mouse click position
  let coordEnd = !isTouchDevice() ? event.clientX : event.touches[0].clientX;
  let progress = (coordEnd - coodStart) / progressBar.offsetWidth;

  // set width to progress
  currentProgess.style.width = progress * 100 + "%";

  // set time
  myVideo.currentTime = progress * myVideo.duration;
});

window.onload = () => {
  // display duration
  myVideo.onloadedmetadata = () => {
    maxDuration.innerText = timeFormatter(myVideo.duration);
  };
  slider();
};

// shortcuts
document.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "k":
      if (videoStatus) {
        pauseVideo();
      } else {
        playVideo();
      }
      break;

    case "m":
      muter();
      break;
    case "f":
      if (videoIsExpand) {
        expandScreen();
      } else {
        normalScreen();
      }
      break;

    default:
      break;
  }
});
