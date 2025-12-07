import mongoose from "mongoose";
import { MONGO_URL } from "./secure";

const ConnectDB=async()=>{
    try {
        await mongoose.connect(MONGO_URL)
        console.log('Server have been connected successfully')
    } catch (error) {
        console.log(error)
        console.log('Failed to connect to mongoDB')
    }
}

module.exports= ConnectDB