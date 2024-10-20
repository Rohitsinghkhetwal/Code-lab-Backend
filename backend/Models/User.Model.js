import mongoose from "mongoose";

export const RoleEnum = ['VIEWER', 'HOST', 'EDITOR'];

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
  },
  documents: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Document',
    }
  ],
  session: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Session'
    }
  ],
  rooms: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room"
    }
  ],
  permission: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Permission",
    }

  ],
  password: {
    type: String,
    required: [true, "Password is required !"]
  },
  avatar: {
    type: {
      url: String,
      localPath: String,
    },
    default: {
      url: `https://via.placeholder.com/200x200.png`,
      localPath: "",
    },
  },
  verificationToken: {
    type: String,
  },
  AccessToken: {
    type: String,
  },
  isVerified: {
    type: Boolean,
    default: false
  }
},
{
  timestamps:true
})

const User = mongoose.model("User", UserSchema);

export default User;