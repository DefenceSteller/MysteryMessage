import { Schema } from "mongoose";
import { Document } from "mongoose";
import mongoose  from "mongoose";

export interface Message extends Document {
    content: string;
    createdAt: Date;
}

const MessageSchema: Schema<Message> = new Schema({
     content:{
        type: String,
        required: true
     },
        createdAt: {
            type: Date,
            requied: true,
            default: Date.now
        }
})

export interface User extends Document {
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifiyCodeExpire: Date;
    isVerfied: boolean;
    isAcceptingMessage: boolean;
    messages: Message[];
}

const UserSchema: Schema<User> = new Schema({
    username: {
        type: String,
        required: [true, "Usernname is required"],
        trim: true,
        unique: true 
    },
    email: {
            type: String,
            requied: [true, "Email is required"],
            unique: true,
            match: [/.+\@.+\..+/, 'please use a valid email address']
    },

    password: {
        type: String,
        required: [true, "Password is required"],
    },

     verifyCode: {
        type: String,
        required: [true, "Verify code is required"],
    },
    verifiyCodeExpire: {
        type: Date,
        required: [true, "Verify code expiry is required"],
    },
    isVerfied: {
        type: Boolean,
        default: false,
    },
    isAcceptingMessage: {
        type: Boolean,
        default: true,
    },
    messages: [MessageSchema]
    })

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", UserSchema);

export default UserModel;
