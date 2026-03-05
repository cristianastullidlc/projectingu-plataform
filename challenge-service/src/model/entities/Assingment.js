import { AssigmentStatus } from "../enums/assigmentStatus.js";

export default class Assignment {
  constructor({
    id,
    challengeId,
    assignedAt,
    candidateId,
    status,
    deadline: deadlineOverride,
  }) {
    this.id = id;
    this.challengeId = challengeId;
    this.assignedAt = assignedAt || new Date();
    this.candidateId = candidateId;
    this.status = status || AssigmentStatus.ASSIGNED;
    this.deadlineOverride = deadlineOverride || null;
  }

  start() {
    if (this.status !== AssigmentStatus.ASSIGNED) {
      throw new Error("Only assigned challenges can be started");
    }

    this.status = AssigmentStatus.IN_PROGRESS;
  }

  markSubmitted(submissionId) {
    if (this.status !== AssigmentStatus.IN_PROGRESS) {
      throw new Error("Only in-progress assignments can be submitted");
    }

    if (!submissionId) {
      throw new Error("Submission ID is required");
    }

    this.submissionId = submissionId;
    this.status = AssigmentStatus.SUBMITTED;
  }

  markAsCompleted() {
    if (this.status !== AssigmentStatus.SUBMITTED) {
      throw new Error("Only submitted assignments can be completed");
    }

    this.status = AssigmentStatus.COMPLETED;
  }

  markAsExpired() {
    if (
      this.status === AssigmentStatus.COMPLETED ||
      this.status === AssigmentStatus.EXPIRED
    ) {
      throw new Error("Assignment cannot be expired");
    }

    this.status = AssigmentStatus.EXPIRED;
  }


  isActive() {
    return [
      AssigmentStatus.ASSIGNED,
      AssigmentStatus.IN_PROGRESS,
      AssigmentStatus.SUBMITTED
    ].includes(this.status);
  }

  isFinished() {
    return [
      AssigmentStatus.COMPLETED,
      AssigmentStatus.EXPIRED
    ].includes(this.status);
  }

  getEffectiveDeadline(globalDeadline) {
    return this.deadlineOverride ?? globalDeadline ?? null;
  }
}