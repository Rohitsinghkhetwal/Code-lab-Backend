import axios from "axios";
import { ApiError } from "../Utils/ApiError.js";
import { AsyncHandler } from "../Utils/AsyncHandler.js";
import { Liveblocks } from "@liveblocks/node";


const liveblocks = new Liveblocks({
  secret: process.env.LIVE_BLOCK_SECRET_KEY
});

export const createRoomId = AsyncHandler(async(req, res) => {
  const {roomId} = req.body;

  const room = await liveblocks.createRoom(roomId, {
    defaultAccesses: ["room:write"]
  })

  console.log("this is a room", room);

  return res.status(200).json({roomId: room.id, message: "Room Created Successfully !"})
})


