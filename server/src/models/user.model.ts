import mongoose, { Schema, type Document } from "mongoose";

export interface IUser extends Document {
    username: string
    email: string
    password: string
    avatar?: string
    createdAt: Date
    updatedAt: Date
}

const userSchema = new Schema<IUser>({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        min: [8, "Password must contain atleast 8 characters"],
        select: false
    },
    avatar: {
        type: String,
        default: ""
    }

}, {
    timestamps: true
})

export const User = mongoose.model("User", userSchema)