const express=require('express');
const app=express();
const server=require("http").Server(app);
const {v4: uuidv4}=require("uuid");
const io=require("socket.io")(server);
const {ExpressPeerServer}=require("peer");
const peerServer=ExpressPeerServer(server,{
    debug:true
});

app.set('view engine','ejs');
app.use(express.static('public'));
app.use('/peerjs',peerServer);

app.get("/",(req,res)=>{
    res.redirect(`/${uuidv4()}`);
});

app.get("/:room",(req,res)=>{
    res.render("room",{roomID:req.params.room});
})

io.on("connection",socket=>{
    // console.log("Connected to Socket");
    socket.on('join-room',(roomID,userId)=>{
        // console.log("Connected to Room "+roomID);
        socket.join(roomID);
        socket.to(roomID).emit('user-connected',userId);
        socket.on("message",message=>{
            io.to(roomID).emit("createMessage",message);
        })
    })
})

const PORT=process.env.PORT || 3030;
server.listen(PORT);