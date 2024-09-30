import mongoose from "mongoose";

const RoomSchema = mongoose.Schema({
  link: { 
    type: String,
     unique: true,
      required: true,
       maxlength: 255 
    },
  document: {
     type: Schema.Types.ObjectId,
      ref: "Document",
       required: true 
    }, 
  users: [
    {
     type: Schema.Types.ObjectId,
      ref: "User" 
    }
  ], 
  isRoomActive: {
     type: Boolean,
      default: true 
    }, 
  createdAt: {
     type: Date,
      default: Date.now
    },


  updatedAt: {
    type: Date,
     default: Date.now 
    },
});

const Room = mongoose.Model('Room', RoomSchema);
export default Room;
