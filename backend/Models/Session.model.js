import mongoose from "mongoose";

const SessionSchema = mongoose.Schema({
  document: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document',
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  connectedAt: {
    type: Date,
    default: Date.now(),
  },
  disconnectedAt: {
    type: Date,
  }
})

const Session = mongoose.Model("Session", SessionSchema);
export default Session;