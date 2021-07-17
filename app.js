const express = require('express');
const app = express();
const http = require('http');
const { Server } = require('socket.io');
const server = http.createServer(app);
const io = new Server(server);
const { userJoin , getUserDetail ,formatMessage ,userLeave ,getRoomUsers} = require('./public/util/user');

app.use(express.static('public'))

app.get('/',(req,res)=>{
    res.sendFile("./index.html");
})


io.on('connection', (socket) => {
   
    socket.on('joinUser',({userName , room})=>{
        let user = userJoin(socket.id , userName , room);

        socket.join(user.room);

        socket.emit('message', formatMessage(`${user.userName}`,`welcome to the chat room ${user.room}`));
        // broadcast when a user connects
        socket.broadcast.to(user.room).emit('message',
          formatMessage("Server", `${user.userName} has joined the chat`)
        );
          // Send users and room info
      io.to(user.room).emit('roomUsers', {
        room: user.room,
       users: getRoomUsers(user.room) 
      });
    });


    // chat message 
    socket.on("chat massage",(msg)=>{
        let user = getUserDetail(socket.id);

        io.to(user.room).emit('message', formatMessage( user.userName, msg ));
    })

     // Runs when client disconnects
 socket.on('disconnect', () => {
    const user = userLeave(socket.id);
    if (user) {
      io.to(user.room).emit('message',
        formatMessage('Server', `${user.userName} has left the chat`)
      );

      // Send users and room info
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
      });
    }
  });
  });


server.listen(5000 ,()=>{console.log("server is running on the port 5000")})