import express from "express"
import 'dotenv/config'
import {createServer} from "node:http"
import {Server} from "socket.io"
import cors from "cors"
import { initializeSocketIO } from "./socket/index.js"
import ConnectDB from "./database/Connection.js"

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
app.set("io", io);

ConnectDB();
//we have created the socket io initializer wrapper utility

initializeSocketIO(io);



 server.listen(PORT, () => {
  console.log(`Server is up and running in ${PORT}` )
 })

