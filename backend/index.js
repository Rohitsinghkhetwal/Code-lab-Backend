import express from "express"
import 'dotenv/config'
import {createServer} from "node:http"
import {Server} from "socket.io"
import cors from "cors"

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
 
 io.on("connection", (socket) => {
  console.log("User id is", socket.id);
  socket.emit('welcome', `Welcome to the chat server${socket.id}`)
 })
 
 server.listen(PORT, () => {
  console.log(`Server is up and running in ${PORT}` )
 })

