import mongoose from "mongoose";

const messageSchema= new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        required: true
    },
    message: {
        type: String,
        trim: true,
        required: true
    },
    createdAt:{
        type:Date,
        default: Date.now
    }
})

const Message= mongoose.models.messages || mongoose.model('messages', messageSchema)

module.exports= Message