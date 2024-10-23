import mongoose from "mongoose";

const RoomSchema = mongoose.Schema({
  link: { 
    type: String,
     unique: true,
      required: true, 
    },
  document: {
     type: mongoose.Schema.Types.ObjectId,
      ref: "Document",
       
    }, 
  users: [
    {
     userId : {
      type: String,
     },
     username: {
      type: String,
     }
    },
    
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

const Room = mongoose.model('Room', RoomSchema);
export default Room;
