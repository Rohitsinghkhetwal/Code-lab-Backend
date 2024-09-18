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

