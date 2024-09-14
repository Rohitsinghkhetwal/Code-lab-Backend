import mongoose from "mongoose";

const chatSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  isGroupChat: {
    type: Boolean,
    required: true,
  },
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "chatmessage",
  },
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users"
    }
  ],
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  }
})

const Chat = mongoose.model("Chat", chatSchema);

export default chatModel;