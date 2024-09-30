import mongoose from "mongoose";

const DocumentSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    maxlength: 255,
  },
  content: {
    type: String,
    default: "",
  },

  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  sessions: [
    {
      type: Schema.Types.ObjectId,
      ref: "Session",
    },
  ],
  permissions: [
    {
      type: Schema.Types.ObjectId,
      ref: "Permission",
    },
  ],
  rooms: [
    {
      type: Schema.Types.ObjectId,
      ref: "Room",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Document = mongoose.Schema('Document', DocumentSchema);
export default Document;
