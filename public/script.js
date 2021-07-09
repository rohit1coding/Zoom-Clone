const socket=io('/');
const videoGrid=document.getElementById("video-grid");
const myVideo=document.createElement("video");
myVideo.muted=true;
// var PORT=3030
// if(process.env.PORT)
//     PORT=443;
let myVideoStream;
var peer = new Peer(undefined,{
    path:'/peerjs',
    host:'/',
    port:"443"
}); 

navigator.mediaDevices.getUserMedia({
    video:true,
    audio:true
}).then(stream=>{
    myVideoStream=stream;
    addVideoStream(myVideo,stream); 

    peer.on('call',(call)=>{
        console.log("Duo Video Chat");
        call.answer(stream);
        const video=document.createElement("video")
        call.on('stream',userVideoStream=>{
            addVideoStream(video,userVideoStream);
        })
    })
    socket.on('user-connected',(userId)=>{
        setTimeout(broadCastUser,1000,userId,stream)
        // broadCastUser(userId,stream);
    })
})

peer.on('open',id=>{
    socket.emit('join-room',ROOM_ID,id);
})

const broadCastUser=(userId,stream)=>{
    const call=peer.call(userId,stream)
    const video=document.createElement('video')
    call.on('stream',userVideoStream=>{
        addVideoStream(video,userVideoStream);
    })
}

const addVideoStream=(video,stream)=>{
    video.srcObject=stream;
    video.addEventListener('loadedmetadata',()=>{
        video.play();
    })
    videoGrid.append(video);
}

let text=$('input')
$('html').keydown((e)=>{
    if(e.which==13 && text.val().length!==0){ 
        console.log(text.val());
        socket.emit('message',text.val());
        text.val('');
    }
})

const scrollToBottom=()=>{
    let d=$('.main__chat_window');
    d.scrollTop(d.prop("scrollHeight"));
}
socket.on("createMessage",message=>{
    $("ul").append(`<li class="message"><b>User: </b> ${message} <br/></li>`);
    scrollToBottom();
})

const muteUnmute=()=>{
    const enabled=myVideoStream.getAudioTracks()[0].enabled;
    if(enabled){
        myVideoStream.getAudioTracks()[0].enabled=false;
        setUnmuteButton();
    }
    else{
        myVideoStream.getAudioTracks()[0].enabled=true;
        setMuteButton();
    }
}
const setMuteButton = () => {
    const html = `
      <i class="fas fa-microphone"></i>
      <span>Mute</span>
    `
    document.querySelector('.main__mute_button').innerHTML = html;
  }
  
  const setUnmuteButton = () => {
    const html = `
      <i class="unmute fas fa-microphone-slash"></i>
      <span>Unmute</span>
    `
    document.querySelector('.main__mute_button').innerHTML = html;
  }

  const playStop = () => {
    console.log('object')
    let enabled = myVideoStream.getVideoTracks()[0].enabled;
    if (enabled) {
      myVideoStream.getVideoTracks()[0].enabled = false;
      setPlayVideo()
    } else {
      setStopVideo()
      myVideoStream.getVideoTracks()[0].enabled = true;
    }
  }

  const setStopVideo = () => {
    const html = `
      <i class="fas fa-video"></i>
      <span>Stop Video</span>
    `
    document.querySelector('.main__video_button').innerHTML = html;
  }
  
  const setPlayVideo = () => {
    const html = `
    <i class="stop fas fa-video-slash"></i>
      <span>Play Video</span>
    `
    document.querySelector('.main__video_button').innerHTML = html;
  }