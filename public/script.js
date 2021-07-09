const socket=io('/');
const videoGrid=document.getElementById("video-grid");
const myVideo=document.createElement("video");
myVideo.muted=true;

var peer = new Peer(undefined,{
    path:'/peerjs',
    host:'/',
    port:'443'
}); 

navigator.mediaDevices.getUserMedia({
    video:true,
    audio:true
}).then(stream=>{
    addVideoStream(myVideo,stream); 

    peer.on('call',(call)=>{
        console.log("Duo Video Chat");
        call.answer(stream);
        const video=document.createElement("video")
        call.on('stream',userVideoStream=>{
            addVideoStream(video,userVideoStream);
        }), function(err) {
            console.log('Failed to get local stream' ,err);}
    })
    socket.on('user-connected',(userId)=>{
        setTimeout(broadCastUser,2000,userId,stream)
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
    }), function(err) {
        console.log('Failed to get local stream' ,err);}
}

const addVideoStream=(video,stream)=>{
    video.srcObject=stream;
    video.addEventListener('loadedmetadata',()=>{
        video.play();
    })
    videoGrid.append(video);
}