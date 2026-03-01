import Submission from "../model/entities/Submission.js";

export default class SubmissionRepositoryMapper {

  static toDomain(document) {
    if (!document) return null;

    return new Submission({
      id: document._id?.toString(),
      assignmentId: document.assignmentId?.toString(),
      challengeId: document.challengeId?.toString(),
      candidateId: document.candidateId,
      content: document.content,
      status: document.status,
      score: document.score,
      feedback: document.feedback,
      submittedAt: document.submittedAt,
      evaluatedAt: document.evaluatedAt
    });
  }

  static toPersistence(submission) {
    return {
      assignmentId: submission.assignmentId,
      challengeId: submission.challengeId,
      candidateId: submission.candidateId,
      content: submission.content,
      status: submission.status,
      score: submission.score,
      feedback: submission.feedback,
      submittedAt: submission.submittedAt,
      evaluatedAt: submission.evaluatedAt
    };
  }
}