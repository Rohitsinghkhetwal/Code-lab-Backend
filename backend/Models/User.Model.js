import mongoose from "mongoose";

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
  RefreshToken: {
    type: String,
  },
  AccessToken: {
    type: String,
  }
},
{
  timestamps:true
})

const User = mongoose.model("User", UserSchema);

export default User;