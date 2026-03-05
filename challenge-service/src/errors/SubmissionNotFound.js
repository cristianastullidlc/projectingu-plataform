
export default class SubmissionNotFoundError extends Error {
  constructor(assignmentId) {
    super(`Submission for assignment with ID ${assignmentId} not found.`);
    this.name = "SubmissionNotFoundError";
    this.assignmentId = assignmentId;
  }
}