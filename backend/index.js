import express from "express"
import 'dotenv/config'
import {createServer} from "node:http"
import cookieParser from "cookie-parser"
import {Server} from "socket.io"
import cors from "cors"
import { initializeSocketIO } from "./socket/index.js"
import ConnectDB from "./database/Connection.js"
import userRoutes from "./Routes/user.routes.js"

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
app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT;
app.set("io", io);

ConnectDB();
//we have created the socket io initializer wrapper utility

app.use("/api/v1/users", userRoutes);

initializeSocketIO(io);



 server.listen(PORT, () => {
  console.log(`Server is up and running in ${PORT}` )
 })

