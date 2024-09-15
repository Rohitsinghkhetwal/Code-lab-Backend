// this is utility function that ensures that makes sockets intances from the server

import { EVENT } from "../Actions.js"
import cookie from "cookie"
import { ApiError } from "../Utils/ApiError.js";
import jwt from "jsonwebtoken"
import User from "../Models/User.Model.js";


const mountJoinChatEvent = (socket) => {
  socket.on(EVENT.JOIN_CHAT_EVENT, (chatId) => {
    console.log(`user joined the chat id:${chatId}`);

    socket.join(chatId);
  })
}


const mountUserTypingEvent = (socket) => {
  socket.on(EVENT.ON_USER_TYPING, (chatId) => {
    socket.in(chatId).emit(EVENT.ON_USER_TYPING, chatId)
  })
}

const mountUserStopTypingEvent = (socket) => {
  socket.on(EVENT.ON_USER_STOP_TYPING, (chatId) => {
    socket.in(chatId).emit(EVENT.ON_USER_STOP_TYPING, chatId);
  })
}


const initializeSocketIO = (io) => {
  return io.on("connection", async(socket) => {
    try{
      const cookies = cookie.parse(socket.handshake.headers?.cookie || "");
      
      let token = cookies?.accessToken;

      if(!token) {
        //check  inside the handsake auth
        token = socket.handshake.auth?.token;
      }

      if(!token) {
        throw new ApiError(401, "Unauthorizes handsake, Token needed !")
      }

      const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

      const user = await User.findById(decodedToken?._id).select("-password -RefreshToken -AccessToken ")

      if(!user) {
        throw new ApiError(401, "Invalid Token Error...")
      }

      socket.user = user;

      // we are creating the room that do not have active chat going on 
      //we will also emit some socket events to the user
      socket.join(user._id.toString());
      socket.emit(EVENT.CONNECTED);
      console.log("User connected successfully", user._id.toString());

      mountJoinChatEvent(socket);
      mountUserTypingEvent(socket);
      mountUserStopTypingEvent(socket);

      //onDisconnect event 

      socket.on(EVENT.DISCONNECTED, () => {
        console.log("user has been disconnected successfully !", socket.user?._id);
        if(socket.user?._id) {
          socket.leave(socket.user?._id);
        }
      })


    }catch(err) {
      //error event
      socket.emit(EVENT.SOCKET_ERROR_EVENT, "Something went wrong or network error")
      console.log("Error connecting the socket......", err);

    }
  })
}

const emitSocketEmit = (req, roomId,event, payload) => {
  req.app.get("io").in(roomId).emit(event, payload);

}

export {initializeSocketIO, emitSocketEmit}



