import express from "express"
import 'dotenv/config'
import {createServer} from "node:http"
import {Server} from "socket.io"
import cors from "cors"
import {EVENT} from "./Actions.js"
import { timeStamp } from "node:console"

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

  // on disconnecting

  //on vedio call 

  //sync code for newly joined user 
})





 io.on("connection", (socket) => {
  console.log("User id is", socket.id);
  socket.emit('welcome', `Welcome to the chat server${socket.id}`)
 })
 
 server.listen(PORT, () => {
  console.log(`Server is up and running in ${PORT}` )
 })

