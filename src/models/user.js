import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'moderator'],
        default: 'user'
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        trim: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }


})



export const User= mongoose.models.users || mongoose.model('users', messageSchema)

