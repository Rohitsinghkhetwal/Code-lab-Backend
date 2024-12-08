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

    console.log(
      "this is result from createRoom api",
      JSON.stringify(result, null, 2)
    );
    return res.status(200).json({ result: result });
  } catch (err) {
    console.log("something went wrong while creating the room", err);
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
    console.log("this is the result from join room", result);

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
      console.log("USER ID FOUND", existingUser);

      // some logic here 

      if (!existingUser) {
        result.users.push({userId, username: user.username});
      }


    } else if (username) {
      // we will check if username will be there !
      const UserName = result.users.find((user) => user.username === username);
      console.log("this is the username", UserName);

      if (!UserName) {
        result.users.push({ username, userId: null });
      }
    }

    await result.save();

    return res
      .status(200)
      .json({ message: "User added the room successfully !" });
  } catch (err) {
    console.log("something went worng !", err);
    return res.status(400).json({ message: "Error in creating the room" });
  }
};



export const leaveRoom = async (req, res) => {
  const { userId, roomId } = req.body;
  try {
    const findRoom = await Room.findOne({ link: roomId });
    console.log('findRoom', JSON.stringify(findRoom, null, 2))

    if (!findRoom) {
      return res.status(400).json({ message: "Room not found !" });
    }

    findRoom.users = findRoom.users.filter((id) => id.toString() !== userId);

    await findRoom.save();

    console.log(" leaving room", findRoom.users);

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
