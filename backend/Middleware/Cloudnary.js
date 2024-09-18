import { v2 as cloudinary } from 'cloudinary';

import fs from 'fs'
import { ApiError } from '../Utils/ApiError';
import 'dotenv/config'




cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLODINARY_API_KEY,
  api_secret:process.env.CLOUDINARY_SECRET_KEY,
})


const uploadCloudinary = async(localFilePath) => {
  try {
    if(!localFilePath) throw new ApiError(404, "path not found !")
      const result = await cloudinary.uploader.upload(localFilePath,{
    resource_type: 'auto'
    })
    fs.unlinkSync(localFilePath)
    return result;


  }catch(err) {
    
    console.log("There was problem in uploading the cloudnary !",err);
    fs.unlinkSync(localFilePath);
    return null;
  }
}  

export { uploadCloudinary }
      
                  