import mongoose from "mongoose";

const MessageModel = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  content: {
    type: String,
    required: true,
  },
  attachments: {
    type: [
      {
        url: String,
        path: String,

      }
    ],
    default: [],
  },
  chat: {
    type: mongoose.Types.Schema,ObjectId,
    ref: "Chat",
  }

})

const Message = mongoose.model("Message", MessageModel);
export default Message;