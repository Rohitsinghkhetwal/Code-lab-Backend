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
    const token = req.cookies?.jwtToken || req.header("Authorization")?.replace("Bearer ", "");
    console.log("request dot header", req.header("Authorization"))
    console.log("this is req body", req.body)
    console.log("cookies", token);

    if(!token) {
      throw new ApiError(400, "Invalid or unauthorized token !")
    }

    const decodedJwt = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log("decodedjwt", decodedJwt);
    const myUser = await User.findById(decodedJwt._id).select("-password");
    console.log("myUser", myUser);


    if(!myUser) {
      throw new ApiError(400, "Invalid Access Token");
    }

    req.AuthorizedUser = myUser;
    
    next();

  }catch(err) {
    throw new ApiError(401, "Invalid Access token or Unathorized !")
  }
})