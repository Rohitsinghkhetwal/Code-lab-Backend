import Room from "../Models/Room.model.js";
import { generateRandomString } from "../Utils/ids.js";

export const createNewRoom = async(req, res) => {
  try {
    const newRoomId = generateRandomString(40);
    console.log("this is a newRoomId", newRoomId)
    const result = await Room.create({
        link: newRoomId,
        users: [],
    })

    console.log('this is result from createRoom api', JSON.stringify(result, null, 2));
    return res.status(200).json({result: result});
  }catch(err) {
    console.log("something went wrong while creating the room", err);
    return res.status(400).json({message: "Error while creating the room"})
  }
}

// join room 
export const joinRoom = async(req, res) => {
  const { userId, roomId} = req.body;
  try {
    // we can find it if it is in the room or not 
    const result = await Room.findOne({ link: roomId});

    if(!result) {
      return res.status(400).json({error: "Room not found"});
    }

    if(!result.users.includes(userId)) {
      result.users.push(userId);
    }

    await result.save();

    return res.status(200).json({message: "User added to the room"});
    
  }catch(err) {
    console.log("something went worng !", err);
    return res.status(400).json({message: "Error in creating the room"});
  }
}

export const leaveRoom = async(req, res) => {
  const {userId , roomId} = req.body;
  try {
    const findRoom = await Room.findOne({link: roomId});

    if(!findRoom) {
      return res.status(400).json({message: "Room not found !"})
    }

    findRoom.users = findRoom.users.filter(id => id.toString() !== userId);

    await findRoom.save();

    console.log(" leaving room", findRoom.users);

    return res.status(200).json({message: "User removed from the room"});

  }catch(err) {
    return res.status(400).json({message: "Somthing went wrong while leaving the room"});

  }
}

// getRoomDetails

export const getRoomDetails = async() => {
  const { roomId } = req.params;
  try {

    const result = await Room.findOne({link: roomId});

    if(!result ) {
      res.status(400).json({message: "Room not found !"})
    }

    return res.status(200).json(result);

  }catch(err) {
    return res.status(400).json({message: "Room not found "})

  }
}