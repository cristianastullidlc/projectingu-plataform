import mongoose from "mongoose";
import { AuthUser } from "../../../models/entities/AuthUser";
import { Role } from "../../../models/enums/Role";

const AuthUserSchema = new mongoose.Schema(
    {
        email: { 
            type: String, 
            required: true, 
            unique: true,
            index: true,
            low,ercase: true,
            trim: true
        },
        role: { type: String, enum: Object.values(Role), required: true },
        provider: { type: String, required: true },
        password: { type: String, required: false },
        providerId: { type: String, required: false }
    },
    {
        timestamps: true,
        collection: "auth_users"
    }
);


export const AuthUserModel = mongoose.model("AuthUser", AuthUserSchema);