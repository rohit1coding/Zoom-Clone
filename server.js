const express=require('express');
const app=express();
const server=require("http").Server(app);
const {v4: uuidv4}=require("uuid");
const io=require("socket.io")(server);
const {ExpressPeerServer}=require("peer");
const peerServer=ExpressPeerServer(server,{
    debug:true
});

const PORT=process.env.PORT || 3030;

app.set('view engine','ejs');
app.use(express.static('public'));
app.use('/peerjs',peerServer);

app.get("/",(req,res)=>{
    res.redirect(`/${uuidv4()}`);
});

app.get("/:room",(req,res)=>{
    res.render("room",{roomID:req.params.room,PORT:PORT});
})

io.on("connection",socket=>{
    socket.on('join-room',(roomID,userId)=>{
        socket.join(roomID);
        socket.to(roomID).emit('user-connected',userId);
        socket.on("message",message=>{
            io.to(roomID).emit("createMessage",message);
        })
        socket.on('disconnect', () => {
            socket.to(roomID).emit('user-disconnected', userId)
          })
    })
})

server.listen(PORT);