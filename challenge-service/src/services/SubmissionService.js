import Submission from "../model/entities/Submission.js";
import { ASSIGNMENT_STATUS } from "../enums/AssignmentStatus.js";

export default class SubmissionService {

  constructor(submissionRepository, assignmentRepository) {
    this.submissionRepository = submissionRepository;
    this.assignmentRepository = assignmentRepository;
  }

  async create(assignmentId, content, user) {

    const assignment = await this.assignmentRepository.findById(assignmentId);

    if (!assignment) {
      throw new Error("Assignment not found");
    }

    if (assignment.candidateId !== user.userId) {
      throw new Error("Not authorized");
    }

    if (assignment.status !== ASSIGNMENT_STATUS.IN_PROGRESS) {
      throw new Error("Assignment must be in progress");
    }

    const exists =
      await this.submissionRepository.existsByAssignment(assignmentId);

    if (exists) {
      throw new Error("Submission already exists for this assignment");
    }

    const submission = new Submission({
      assignmentId,
      challengeId: assignment.challengeId,
      candidateId: assignment.candidateId,
      content
    });

    submission.submit();

    const savedSubmission =
      await this.submissionRepository.create(submission);

    assignment.markSubmitted();

    await this.assignmentRepository.update(assignment);

    return savedSubmission;
  }

  async findById(id, user) {

    const submission =
      await this.submissionRepository.findById(id);

    if (!submission) {
      throw new Error("Submission not found");
    }

    if (user.role === "CANDIDATE" &&
        submission.candidateId !== user.userId) {
      throw new Error("Not authorized");
    }

    return submission;
  }

  async findByAssignmentId(assignmentId, user) {

    const submission =
      await this.submissionRepository.findByAssignmentId(assignmentId);

    if (!submission) {
      throw new Error("Submission not found");
    }

    if (user.role === "CANDIDATE" &&
        submission.candidateId !== user.userId) {
      throw new Error("Not authorized");
    }

    return submission;
  }

  async evaluate(submissionId, decision, score, feedback, user) {

  if (!["ADMIN", "RECRUITER"].includes(user.role)) {
    throw new Error("Not authorized to evaluate");
  }

  const submission =
    await this.submissionRepository.findById(submissionId);

  if (!submission) {
    throw new Error("Submission not found");
  }

  const assignment =
    await this.assignmentRepository.findById(submission.assignmentId);

  if (decision === "PASSED") {
    submission.markAsPassed(score, feedback);
    assignment.markAsCompleted();
  }

  else if (decision === "FAILED") {
    submission.markAsFailed(score, feedback);
    assignment.markAsExpired(); // o lo que definas como política
  }

  else {
    throw new Error("Invalid evaluation decision");
  }

  await this.submissionRepository.update(submission);
  await this.assignmentRepository.update(assignment);

  return submission;
}
}