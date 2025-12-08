import mongoose from "mongoose";

const projectSchema= new mongoose.Schema({
    title:{
        type:String,
        trime: true,
        required: true,
    },
    slug:{
        type:String,
        trime: true,
        required: true,
    },
    description:{
        type:String,
        trime: true,
        required: true,
    },
    image:{
        type:String,
        trime: true,
        required: true,
    },
    imageId:{
        type:String,
        trime: true,
        required: true,
    },
    

})