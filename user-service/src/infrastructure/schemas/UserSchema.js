import mongoose from "mongoose";
import { Roles } from "../../models/enums/Roles.js";

const userSchema = new mongoose.Schema(
    {
        userId: {
        type: String,
        required: true,
        unique: true,
        index: true
        },
        name: {
        type: String,
        required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        identification: {
            type: String,
            required: true,
            max: 20,
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
        },
        role: {
            type: String, 
            enum: Object.values(Roles),
            required: true,
        },
        authProvider: {
        type: String
        }
    },
    {
        timestamps: true,
        collection: "users",
    }
)



export const UserModel = mongoose.model("User", userSchema);
