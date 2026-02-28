import mongoose from "mongoose";
import { Difficulty } from "../../models/enums/Difficulty.js";
import { Status } from "../../models/enums/Status.js";

const ChallengeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    difficulty: {
        type: String,
        enum: Object.values(Difficulty),
        required: true
    },
    techStack: [{
        type: String,
        trim: true
    }],
    createdBy: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: Object.values(Status),
        default: Status.DRAFT
    },
    deadline: {
        type: Date
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    deletedAt: {
        type: Date,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastUpdatedAt: {
        type: Date,
        default: Date.now
    }
},
{
    timestamps: true,
    collection: "challenges"
}
)

export const ChallengeModel = mongoose.model("Challenge", ChallengeSchema);