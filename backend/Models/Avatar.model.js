import mongoose from "mongoose";

const AvatarSchema = mongoose.Schema({
  avatar: {
    type: {
      url: String,
      localPath: String
    },
    default: {
      url:  `https://via.placeholder.com/200x200.png`,
      localPath: ""
    }
  }
},
{
  timeStamps: true
})

const Avatar = mongoose.model("Avatar", AvatarSchema);
export default Avatar;