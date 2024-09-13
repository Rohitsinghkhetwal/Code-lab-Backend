import express from "express"
import 'dotenv/config'
import {createServer} from "node:http"
import {Server} from "socket.io"
import cors from "cors"
import {EVENT} from "./Actions.js"

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  }
});

app.use(cors())

const PORT = process.env.PORT;

// we have to intgrate the users arrays that are joined in the room
// it will return all the array of objects into array
const userObj = {};

const getAllConnectedUsers = (roomId) => {
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map((socketId) => {
    return {
      socketId,
      username: userObj[socketId]
    }

  }) 
}

io.on("connection", (socket) => {
  socket.on(EVENT.JOIN, ({roomId, username}) => {
    userObj[socket.id] = username;
    const users = getAllConnectedUsers(roomId);
    console.log("this is users", users)
    // we can iterate the getAllConnected user array of object
    users.forEach(({ socketId }) => {
      io.to(socketId).emit(EVENT.JOINED, {
        users,
        username,
        socketId: socket.id
      })
    })
  })
  
  // send message to all the users 
  socket.on(EVENT.GROUP_CHAT, ({roomId, message}) => {
    const Username = userObj[socket.id];
    const chatMessage = {
      Username,
      message,
      timeStamp: new Date()
    }

    io.in(roomId).emit(EVENT.GROUP_CHAT, chatMessage);
  })

  // on code sync

  socket.on(EVENT.ON_CODE_SYNC, ({code, socketId}) => {
    io.to(socketId).emit(EVENT.ON_CODE_SYNC, {code});
  })

  //on code change

  socket.on(EVENT.CODE_CHANGE, ({roomId, code}) => {
    io.to(roomId).emit(EVENT.CODE_CHANGE, {code});

  })

  // on disconnecting
  socket.on("disconnecting", () => {
    const room = [...socket.rooms];
    console.log("rooms", room);

    room.forEach((roomId) => {
      socket.in(roomId).emit(EVENT.DISCONNECTED, {
        id: socket.id,
        username: userObj[socket.id]
      })
    })

    delete userObj[socket.id]
    socket.leave();


  })

  //on vedio call 

  //on vedio answer
})


 
 server.listen(PORT, () => {
  console.log(`Server is up and running in ${PORT}` )
 })

