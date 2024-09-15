import mongoose from "mongoose";

const ConnectDB = async() => {
  try{
    const connection = await mongoose.connect(process.env.MONGO_URI);
    if(connection) {
      console.log("Database connected successfully !");
    }

  }catch(err) {
    console.log("Something went wrong !")
  }

}

export default ConnectDB;