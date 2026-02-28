export default class AssignmentNotFoundError extends Error {
  constructor(assignmentId) {
    super(`Assignment with ID ${assignmentId} not found.`);
    this.name = "AssignmentNotFoundError";
    this.assignmentId = assignmentId;
  }
}