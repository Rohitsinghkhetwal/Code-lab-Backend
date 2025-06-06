import Room from "../Models/Room.model.js";
import User from "../Models/User.Model.js";
import { generateRandomString } from "../Utils/ids.js";



export const createNewRoom = async (req, res) => {
  try {
    const newRoomId = generateRandomString(40);
    const result = await Room.create({
      link: newRoomId,
      users: [],
    });

    return res.status(200).json({ result: result });
  } catch (err) {
    
    return res.status(400).json({ message: "Error while creating the room" });
  }
};

// Add user to room
export const joinRoom = async (req, res) => {
  const { roomId } = req.params;
  const { userId, username } = req.body;
  try {
    // we can find it if it is in the room or not
    const result = await Room.findOne({ link: roomId });
   

    if (!result) {
      return res.status(400).json({ error: "Room not found" });
    }

    if (userId) {
      // we will check the user that it is present in database or not

      const user = await User.findById(userId);
     

      if(!user) {
        return res.status(400).json({message: "User not found !"});
      }

      const existingUser = result.users.find((user) => user.userId === userId);
      

      // some logic here 

      if (!existingUser) {
        result.users.push({userId, username: user.username});
      }


    } else if (username) {
      // we will check if username will be there !
      const UserName = result.users.find((user) => user.username === username);
     

      if (!UserName) {
        result.users.push({ username, userId: null });
      }
    }

    await result.save();

    return res
      .status(200)
      .json({ message: "User added the room successfully !" });
  } catch (err) {
    
    return res.status(400).json({ message: "Error in creating the room" });
  }
};



export const leaveRoom = async (req, res) => {
  const { userId, roomId } = req.body;
  try {
    const findRoom = await Room.findOne({ link: roomId });
    

    if (!findRoom) {
      return res.status(400).json({ message: "Room not found !" });
    }

    findRoom.users = findRoom.users.filter((id) => id.toString() !== userId);

    await findRoom.save();

    

    return res.status(200).json({ message: "User removed from the room" });
  } catch (err) {
    return res
      .status(400)
      .json({ message: "Somthing went wrong while leaving the room" });
  }
};

// getRoomDetails

export const getRoomDetails = async (req, res) => {
  const { roomId } = req.params;
  try {
    const result = await Room.findOne({ link: roomId });

    if (!result) {
      res.status(400).json({ message: "Room not found !" });
    }

    return res.status(200).json(result);
  } catch (err) {
    return res.status(400).json({ message: "Room not found " });
  }
};
