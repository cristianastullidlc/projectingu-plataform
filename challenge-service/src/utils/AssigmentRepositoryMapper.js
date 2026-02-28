import Assignment from "../model/entities/Assingment.js";

export default class AssignmentRepositoryMapper {
  static toDomain(document) {
    if (!document) return null;

    return new Assignment({
      id: document._id?.toString() ?? document.id ?? null,
      challengeId: document.challengeId?.toString(),
      assignedAt: document.assignedAt,
      candidateId: document.candidateId,
      status: document.status,
      deadlineOverride: document.deadlineOverride ?? null,
      submissionId: document.submissionId?.toString() ?? null,
    });
  }

  static toPersistence(assignment) {
    return {
      challengeId: assignment.challengeId,
      assignedAt: assignment.assignedAt,
      candidateId: assignment.candidateId,
      status: assignment.status,
      deadlineOverride: assignment.deadlineOverride,
      submissionId: assignment.submissionId
    };
  }
}