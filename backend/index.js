import express from "express";
import "dotenv/config";
import { createServer } from "node:http";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import cors from "cors";
import ConnectDB from "./database/Connection.js";
import userRoutes from "./routes/user.routes.js";
import roomRoutes from "./routes/room.routes.js";
import validateUser from "./routes/validator.routes.js";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://6759ed947e2f820008387881--curious-bavarois-44328d.netlify.app",
    methods: ["GET", "POST"]
  }
})
app.use(cookieParser());
//https://curious-bavarois-44328d.netlify.app
app.use(
  cors({
    origin: "https://6759ed947e2f820008387881--curious-bavarois-44328d.netlify.app",
    credentials: true,
  })
);
app.use(express.json());

const PORT = process.env.PORT;
app.set("io", io);

ConnectDB();
//we have created the socket io initializer wrapper utility

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/room", roomRoutes);
app.use("/api/v1/validator", validateUser);

// socket intialization for voice chat 

const rooms = {};

io.on("connection", (socket) => {

  //join a room
  socket.on("join-room", ({ roomId, userId = null, username = null }) => {
    if (!userId && username) {
      return;
    }

    

    // add the user to room
    if (!rooms[roomId]) {
      rooms[roomId] = [];
      
    }

    const existingUser = rooms[roomId].find(
      (user) => user.userId === userId || user.username === username
    );

    if (existingUser) {
      
    
    } else {
      rooms[roomId].push({
        userId: userId || null,
        username: username || null,
        socketId: socket.id,
      });
    }

    // join the socket.io room
    socket.join(roomId);

    socket.to(roomId).emit("user-Joined", {
      userId,
      username,
      socketId: socket.id,
    });
  });

  //handle sdp offer 
  socket.on("offer", ({ roomId, offer, sender}) => {
    socket.to(roomId).emit("offer", { offer, sender });
  })

  socket.on("answer", ({ roomId, answer, sender}) => {
    socket.to(roomId).emit("answer", { answer, sender });
  })

  socket.on("ice-candidate", ({ roomId, candidate, sender}) => {
    socket.to(roomId).emit("ice-candidate", { candidate, sender });
  })

  // user when disconnects 
  socket.on("disconnect", () => {

    for(const roomId in rooms ) {
      rooms[roomId] = rooms[roomId].filter((user) => user.socketId !== socket.id);
      socket.to(roomId).emit("user-left", { socketId: socket.id});

      //cleans up the rooms
      if(rooms[roomId].length === 0) {
        delete rooms[roomId]
      }
    }
  })
});

server.listen(PORT, () => {
  console.log(`Server is up and running in ${PORT}`);
});
