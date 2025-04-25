import User from "../Models/User.Model.js";
import { AsyncHandler } from "../Utils/AsyncHandler.js";
import {ApiError} from "../Utils/ApiError.js"
import bcypt from "bcrypt"
import { ApiResponse } from "../Utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import { uploadCloudinary } from "../Middleware/Cloudnary.js";

const GenerateJwtToken = (_id) => {
  const token = jwt.sign({_id}, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
  })
  return token;
}

export const Signup = AsyncHandler(async(req, res) => {
  // sign up logic here => 
  const {username, email, password} = req.body;

  if(
    [username, email].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(404, "All fields are required !")
  }

  const existingUser = await User.findOne({
    $or: [{username},{email}]
  })

  if(existingUser) {
    res.status(400).json({message: "username already taken"});
  }

  const passwordHash = await bcypt.hash(password, 12);
  const verificationToken = Math.floor(1000000 + Math.random() * 9000000).toString();

  // we have to set cookies here also 



  const DatabaseEntry = await User.create({
    username,
    email,
    password: passwordHash,
    verificationToken
  })

  return res.status(200).json(new ApiResponse({
    username: DatabaseEntry.username,
    email: DatabaseEntry.email,
    avatar: DatabaseEntry.avatar,
    isVerified: DatabaseEntry.isVerified,
  }, "User Registered successfully !"))
})

// login api 

export const Login = AsyncHandler(async(req, res) => {
  const {email, password} = req.body;

  if(!(email || password)) {
    throw new ApiError(400, "Email or Password required !")
  }

  const result = await User.findOne({email});

  if(!result) {
    throw new ApiError(401, "User does not exist");
  }

  const comparePassword = await bcypt.compare(password, result.password);

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "None"
  }

  if(comparePassword){
    const JwtToken = GenerateJwtToken(result._id);
    return res
    .status(200)
    .cookie("jwtToken", JwtToken, options)
    .json({
      user: {
        _id: result._id,
        username: result.username,
        email: result.email,
      },
      message: "User Logged In successfully !"
    })
  }
})

// api for verify email


export const VerifyEmail = AsyncHandler(async(req, res) => {
  const { code } = req.body;

  const ExistingUser = await User.findOne({
    verificationToken: code
  })

  if(!ExistingUser) {
    throw new ApiError(400, "Expired or Invalid varification code")
  }

  ExistingUser.isVerified = true;
  ExistingUser.verificationToken = undefined;
  await ExistingUser.save();

  return res.status(200).json({
    message: "User verified successfully !",
    user: {
      ...ExistingUser._doc,
      password: undefined,
    }
  })
})

// api for logout 


export const Logout = AsyncHandler(async(req, res) => {
  await User.findByIdAndUpdate(req.AuthorizedUser._id, {
    $set: {
      AccessToken: undefined
    }
  },
  {
    new: true
  }
);

const options = {
  httpOnly: true,
  secure: true,
  sameSite: "none"
 }

 return res.status(200)
 .clearCookie("jwtToken", options)
 .clearCookie("refreshToken", options)
 .json(new ApiResponse(200, {}, "User Logged Out Success !"))

})

//api for upload image 

export const uploadImage = AsyncHandler(async(req, res) => {
  const userId = req.AuthorizedUser;
  // avatar local path is the path of the file 

  const avatarLocalPath = req.files?.avatar[0]?.path;
  
  // now we have to send this path to cloudinary
  if(!avatarLocalPath) {
    throw new ApiError(400, "File path is required here !");
  }

  const uploadToCloudinary = await uploadCloudinary(avatarLocalPath);
 

  if(!uploadToCloudinary) {
    throw new ApiError(400, "Api is required ");
  }

  //now we will save to database or edit it

  const databaseEntry = await User.findByIdAndUpdate(userId._id, {
    $set: {
      avatar: {
        url: uploadToCloudinary.url || "",
        localPath: avatarLocalPath
      }
    }
  },{
    new: true
  }).select("-password -verificationToken");

  return res.status(200).json(new ApiResponse(200, databaseEntry,"Profile picture updated successfully !"))
})
  
  