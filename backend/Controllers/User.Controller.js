import User from "../Models/User.Model.js";
import { AsyncHandler } from "../Utils/AsyncHandler.js";
import {ApiError} from "../Utils/ApiError.js"
import bcypt from "bcrypt"
import { ApiResponse } from "../Utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import { SendVerificationEmail } from "../Email/Email.js";

const GenerateJwtToken = (_id) => {
  const token = jwt.sign({_id}, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
  })
  return token;
}

const GenerateRefreshToken = (_id) => {
  const result = jwt.sign({_id}, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY
  })
  return result;
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
    throw new ApiError(400, "User already exist !")
  }

  const passwordHash = await bcypt.hash(password, 12);
  const verificationToken = Math.floor(1000000 + Math.random() * 9000000).toString();


  const DatabaseEntry = await User.create({
    username,
    email,
    password: passwordHash,
    verificationToken
  })

  await SendVerificationEmail(DatabaseEntry.email, verificationToken);

  console.log("users from user controller", DatabaseEntry);

  return res.status(200).json(new ApiResponse(DatabaseEntry, "User Registered successfully !"))
})

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
  }

  if(comparePassword){
    const JwtToken = GenerateJwtToken(result._id);
    const refreshToken = GenerateRefreshToken(result._id);
    return res
    .status(200)
    .cookie("jwtToken", JwtToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json({refreshToken,
      user: {
        _id: result._id,
        username: result.username,
        email: result.email
      },
      message: "User Logged In successfully !"
    })
  }
})


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



export const Logout = AsyncHandler(async(req, res) => {
  await User.findByIdAndUpdate(req.AuthorizedUser._id, {
    $set: {
      RefreshToken: undefined
    }
  },
  {
    new: true
  }
);

const options = {
  httpOnly: true,
  secure: true,
 }

 return res.status(200)
 .clearCookie("jwtToken", options)
 .clearCookie("refreshToken", options)
 .json(new ApiResponse(200, {}, "User Logged Out Success !"))

})

