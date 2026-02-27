import { Mongoose } from "mongoose";

const userSchema = new Mongoose.Schema(
    {
        name: {
        type: 'string',
        required: true,
    },
    lastName: {
        type: 'string',
        required: true,
    },
    identification: {
        type: 'string',
        required: true,
        max: 20,
    },
    email: {
        type: 'string',
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    role: {
        type: 'string', 
        enum: Object.values(Role),
        required: true,
    },
    },
    {
        timestamps: true,
        collection: "users",
    }
)



export const UserModel = Mongoose.model("User", userSchema);
