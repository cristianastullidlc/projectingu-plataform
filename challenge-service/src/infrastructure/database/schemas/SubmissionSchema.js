// infrastructure/persistence/schemas/SubmissionSchema.js

import mongoose from "mongoose";
import { SubmissionStatus } from "../../../model/enums/SubmissionStatus.js";

const SubmissionSchema = new mongoose.Schema(
  {
    assignmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assignment",
      required: true
    },
    challengeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Challenge",
      required: true
    },
    candidateId: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: Object.values(SubmissionStatus),
      default: SubmissionStatus.DRAFT,
      required: true
    },
    score: {
      type: Number,
      default: null
    },
    feedback: {
      type: String,
      default: null
    },
    submittedAt: {
      type: Date,
      default: null
    },
    evaluatedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true,
    collection: "submissions"
  }
);

SubmissionSchema.index({ assignmentId: 1 }, { unique: true });

export const SubmissionModel =
  mongoose.model("Submission", SubmissionSchema);