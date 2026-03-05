import Submission from "../model/entities/Submission.js";
import { SubmissionStatus } from "../model/enums/SubmissionStatus.js";
import InvalidCredentialsError from "../errors/InvalidCredentialsError.js";
import AssignmentNotFoundError from "../errors/AssigmentNotFound.js";
import SubmissionNotFound from "../errors/SubmissionNotFound.js";

export default class SubmissionService {

  constructor(submissionRepository, assignmentRepository) {
    this.submissionRepository = submissionRepository;
    this.assignmentRepository = assignmentRepository;
  }

  async create(assignmentId, content, user) {

    const assignment = await this.assignmentRepository.findById(assignmentId);

    if (!assignment) {
      throw new AssignmentNotFoundError(assignmentId);
    }

    if (assignment.candidateId !== user.userId) {
      throw new InvalidCredentialsError("Not authorized");
    }

    if (assignment.status !== SubmissionStatus.IN_PROGRESS) {
      throw new InvalidCredentialsError("Assignment must be in progress");
    }

    const exists =
      await this.submissionRepository.existsByAssignment(assignmentId);

    if (exists) {
      throw new InvalidCredentialsError("Submission already exists for this assignment");
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
      throw new SubmissionNotFound(id);
    }

    if (user.role === "CANDIDATE" &&
        submission.candidateId !== user.userId) {
      throw new InvalidCredentialsError("Not authorized");
    }

    return submission;
  }

  async findByAssignmentId(assignmentId, user) {

    const submission =
      await this.submissionRepository.findByAssignmentId(assignmentId);

    if (!submission) {
      throw new SubmissionNotFound(assignmentId);
    }

    if (user.role === "CANDIDATE" &&
        submission.candidateId !== user.userId) {
      throw new InvalidCredentialsError("Not authorized");
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
    throw new SubmissionNotFound(submissionId);
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
    throw new InvalidCredentialsError("Invalid evaluation decision");
  }

  await this.submissionRepository.update(submission);
  await this.assignmentRepository.update(assignment);

  return submission;
}
}