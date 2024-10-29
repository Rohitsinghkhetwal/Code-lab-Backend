import express from "express"
import 'dotenv/config'
import {createServer} from "node:http"
import cookieParser from "cookie-parser"
import {Server} from "socket.io"
import cors from "cors"
import { initializeSocketIO } from "./socket/index.js"
import ConnectDB from "./database/Connection.js"
import userRoutes from "./routes/user.routes.js"
import roomRoutes from "./routes/room.routes.js"
import validateUser from "./routes/validator.routes.js"

const app = express();
const server = createServer(app);
const io = new Server(server);
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}))
app.use(express.json());


const PORT = process.env.PORT;
app.set("io", io);

ConnectDB();
//we have created the socket io initializer wrapper utility

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/room", roomRoutes)
app.use("/api/v1/validator", validateUser)

initializeSocketIO(io);



 server.listen(PORT, () => {
  console.log(`Server is up and running in ${PORT}` )
 })

