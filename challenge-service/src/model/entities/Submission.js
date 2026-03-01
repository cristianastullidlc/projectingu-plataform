import { SUBMISSION_STATUS } from "../enums/SubmissionStatus.js";

export default class Submission {

  constructor({
    id,
    assignmentId,
    challengeId,
    candidateId,
    content,
    status,
    score,
    feedback,
    submittedAt,
    evaluatedAt
  }) {
    this.id = id;
    this.assignmentId = assignmentId;
    this.challengeId = challengeId;
    this.candidateId = candidateId;
    this.content = content; // código, link, texto, etc.
    this.status = status || SUBMISSION_STATUS.DRAFT;
    this.score = score ?? null;
    this.feedback = feedback ?? null;
    this.submittedAt = submittedAt ?? null;
    this.evaluatedAt = evaluatedAt ?? null;
  }

  submit() {
    if (this.status !== SUBMISSION_STATUS.DRAFT) {
      throw new Error("Only draft submissions can be submitted");
    }

    this.status = SUBMISSION_STATUS.SUBMITTED;
    this.submittedAt = new Date();
  }

  isEvaluated() {
    return this.status === SUBMISSION_STATUS.PASSED || this.status === SUBMISSION_STATUS.FAILED;
  }

  markAsPassed(score, feedback) {
    if (this.status !== SUBMISSION_STATUS.SUBMITTED) {
      throw new Error("Only submitted submissions can be marked as passed");
    }

    this.status = SUBMISSION_STATUS.PASSED;
    this.score = score;
    this.feedback = feedback;
    this.evaluatedAt = new Date();
  }

  markAsFailed(score, feedback) {
    if (this.status !== SUBMISSION_STATUS.SUBMITTED) {
      throw new Error("Only submitted submissions can be marked as failed");
    }

    this.status = SUBMISSION_STATUS.FAILED;
    this.score = score;
    this.feedback = feedback;
    this.evaluatedAt = new Date();
  }
}