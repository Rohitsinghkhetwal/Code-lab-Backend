import User from "../Models/User.Model.js";
import { ApiError } from "../Utils/ApiError.js";
import { AsyncHandler } from "../Utils/AsyncHandler.js";
import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config({
  path:"../.env"
})



export const verifyAuth = AsyncHandler(async(req, _, next) => {
  try{
    const token = req.cookies?.jwtToken || req.header("Authorization")?.replace("Bearer", "");

    if(!token) {
      throw new ApiError(400, "Invalid or unauthorized token !")
    }

    const decodedJwt = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const myUser = await User.findById(decodedJwt._id).select("-password -RefreshToken");


    if(!myUser) {
      throw new ApiError(400, "Invalid Access Token");
    }

    req.AuthorizedUser = myUser;
    
    next();

  }catch(err) {
    throw new ApiError(401, "Invalid Access token or Unathorized !")
  
  }
})