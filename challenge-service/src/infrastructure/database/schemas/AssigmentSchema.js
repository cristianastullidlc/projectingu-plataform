import mongoose from 'mongoose';
import { AssignmentStatus } from '../../models/enums/AssignmentStatus.js';

const AssigmentSchema = new mongoose.Schema({
    challengeId: 
    { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Challenge', 
        required: true 
    },
    assignedAt: 
    { 
        type: Date, 
        default: Date.now,
        required: true
    },
    candidateId: 
    { 
        type: String,
        required: true 
    },
    status: 
    { type: String, 
        enum: Object.values(AssignmentStatus), 
        default: 'assigned',
        required: true
    },
    deadlineOverride: 
    { 
        type: Date,
        required: false,
        default: null

    },
    submissionId: 
    { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Submission', 
        required: false 
    }
},
{
    timestamps: true,
    collection: 'assignments'
}
);

AssigmentSchema.index({ candidateId: 1, challengeId: 1 }, { unique: true });

export const AssignmentModel = mongoose.model('Assignment', AssigmentSchema);