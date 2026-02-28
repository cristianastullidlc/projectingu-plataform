import { ASSIGNMENT_STATUS } from "../enums/assigmentStatus.js";

export default class Assignment {
  constructor({
    id,
    challengeId,
    assignedAt,
    candidateId,
    status,
    deadline: deadlineOverride,
    submissionId
  }) {
    this.id = id;
    this.challengeId = challengeId;
    this.assignedAt = assignedAt || new Date();
    this.candidateId = candidateId;
    this.status = status || ASSIGNMENT_STATUS.ASSIGNED;
    this.deadlineOverride = deadlineOverride || null;
    this.submissionId = submissionId || null;
  }

  start() {
    if (this.status !== ASSIGNMENT_STATUS.ASSIGNED) {
      throw new Error("Only assigned challenges can be started");
    }

    this.status = ASSIGNMENT_STATUS.IN_PROGRESS;
  }

  markSubmitted(submissionId) {
    if (this.status !== ASSIGNMENT_STATUS.IN_PROGRESS) {
      throw new Error("Only in-progress assignments can be submitted");
    }

    if (!submissionId) {
      throw new Error("Submission ID is required");
    }

    this.submissionId = submissionId;
    this.status = ASSIGNMENT_STATUS.SUBMITTED;
  }

  markAsCompleted() {
    if (this.status !== ASSIGNMENT_STATUS.SUBMITTED) {
      throw new Error("Only submitted assignments can be completed");
    }

    this.status = ASSIGNMENT_STATUS.COMPLETED;
  }

  markAsExpired() {
    if (
      this.status === ASSIGNMENT_STATUS.COMPLETED ||
      this.status === ASSIGNMENT_STATUS.EXPIRED
    ) {
      throw new Error("Assignment cannot be expired");
    }

    this.status = ASSIGNMENT_STATUS.EXPIRED;
  }


  isActive() {
    return [
      ASSIGNMENT_STATUS.ASSIGNED,
      ASSIGNMENT_STATUS.IN_PROGRESS,
      ASSIGNMENT_STATUS.SUBMITTED
    ].includes(this.status);
  }

  isFinished() {
    return [
      ASSIGNMENT_STATUS.COMPLETED,
      ASSIGNMENT_STATUS.EXPIRED
    ].includes(this.status);
  }

  getEffectiveDeadline(globalDeadline) {
    return this.deadlineOverride ?? globalDeadline ?? null;
  }
}