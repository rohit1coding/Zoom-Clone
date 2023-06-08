const socket = io("/");
// All The videos will be displayed at here
const videoGrid = document.getElementById("video-grid");
// My Video will displayed at here
const myVideo = document.createElement("video");
// My mic will be muted
myVideo.muted = true;
let myVideoStream;
const peers = {};
var peer = new Peer(undefined, {
  path: "/peerjs",
  host: "/",
  port: "443",
  //Use this for Development
  // port: '3030'
});

// Getting Access of User video and Audio
navigator.mediaDevices
  .getUserMedia({
    video: true,
    audio: true,
  })
  .then((stream) => {
    myVideoStream = stream;
    addVideoStream(myVideo, stream);
    //Answer the Call
    peer.on("call", (call) => {
      console.log("Duo Video Chat");
      call.answer(stream);
      const video = document.createElement("video");
      call.on("stream", (userVideoStream) => {
        addVideoStream(video, userVideoStream);
      });
    });
    //When a new User connect... Broadcast this User to EveryOne
    socket.on("user-connected", (userId) => {
      setTimeout(broadCastUser, 1000, userId, stream);
    });
  });

//When disconnect remove from the Call
socket.on("user-disconnected", (userId) => {
  if (peers[userId]) peers[userId].close();
});

//Joining a room
peer.on("open", (id) => {
  socket.emit("join-room", ROOM_ID, id);
});

//BroadCast User to EveryOne
const broadCastUser = (userId, stream) => {
  const call = peer.call(userId, stream);
  const video = document.createElement("video");
  call.on("stream", (userVideoStream) => {
    addVideoStream(video, userVideoStream);
  });
  call.on("close", () => {
    video.remove();
  });
  peers[userId] = call;
};
//Creating a Video Stream
const addVideoStream = (video, stream) => {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });
  videoGrid.append(video);
};

// ------For Chat Section-----
socket.on("createMessage", (message) => {
  $("ul").append(`<li class="message"><b>User: </b> ${message} <br/></li>`);
  scrollToBottom();
});
let text = $("input");
$("html").keydown((e) => {
  if (e.which == 13 && text.val().length !== 0) {
    console.log(text.val());
    socket.emit("message", text.val());
    text.val("");
  }
});
const scrollToBottom = () => {
  let d = $(".main__chat_window");
  d.scrollTop(d.prop("scrollHeight"));
};
//--------------------------//

// ---------Audio Mute Unmute Section---------
const muteUnmute = () => {
  const enabled = myVideoStream.getAudioTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getAudioTracks()[0].enabled = false;
    setUnmuteButton();
  } else {
    myVideoStream.getAudioTracks()[0].enabled = true;
    setMuteButton();
  }
};
const setMuteButton = () => {
  const html = `
      <i class="fas fa-microphone"></i>
      <span>Mute</span>
    `;
  document.querySelector(".main__mute_button").innerHTML = html;
};

const setUnmuteButton = () => {
  const html = `
      <i class="unmute fas fa-microphone-slash"></i>
      <span>Unmute</span>
    `;
  document.querySelector(".main__mute_button").innerHTML = html;
};
//--------------------------//

// ---------Video Mute Unmute Section---------
const playStop = () => {
  console.log("object");
  let enabled = myVideoStream.getVideoTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getVideoTracks()[0].enabled = false;
    setPlayVideo();
  } else {
    setStopVideo();
    myVideoStream.getVideoTracks()[0].enabled = true;
  }
};

const setStopVideo = () => {
  const html = `
      <i class="fas fa-video"></i>
      <span>Stop Video</span>
    `;
  document.querySelector(".main__video_button").innerHTML = html;
};

const setPlayVideo = () => {
  const html = `
    <i class="stop fas fa-video-slash"></i>
      <span>Play Video</span>
    `;
  document.querySelector(".main__video_button").innerHTML = html;
};
//--------------------------//
