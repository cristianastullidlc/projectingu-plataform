import Assignment from "../model/entities/Assignment.js";

export default class AssignmentService {

  constructor(assignmentRepository, challengeRepository) {
    this.assignmentRepository = assignmentRepository;
    this.challengeRepository = challengeRepository;
  }


  async create(challengeId, candidateId, user, deadlineOverride) {

    if (!challengeId) throw new Error("Challenge ID is required");
    if (!candidateId) throw new Error("Candidate ID is required");

    if (!["ADMIN", "RECRUITER"].includes(user.role)) {
      throw new Error("Not authorized to assign challenges");
    }

    const challenge = await this.challengeRepository.findById(challengeId);

    if (!challenge) {
      throw new Error("Challenge not found");
    }

    if (user.role === "RECRUITER" && challenge.createdBy !== user.userId) {
      throw new Error("Not authorized to assign this challenge");
    }

    const alreadyExists =
      await this.assignmentRepository.exists(candidateId, challengeId);

    if (alreadyExists) {
      throw new Error("Assignment already exists for this candidate");
    }

    const assignment = new Assignment({
      challengeId,
      candidateId,
      deadlineOverride
    });

    return await this.assignmentRepository.create(assignment);
  }

  // ================= FIND BY ID =================

  async findById(id, user) {

    if (!id) throw new Error("ID is required");

    const assignment = await this.assignmentRepository.findById(id);

    const challenge =
      await this.challengeRepository.findById(assignment.challengeId);

    switch (user.role) {

      case "ADMIN":
        return assignment;

      case "RECRUITER":
        if (challenge.createdBy !== user.userId) {
          throw new Error("Not authorized");
        }
        return assignment;

      case "CANDIDATE":
        if (assignment.candidateId !== user.userId) {
          throw new Error("Not authorized");
        }
        return assignment;

      default:
        throw new Error("Invalid role");
    }
  }

  // ================= FIND BY CHALLENGE =================

  async findByChallengeId(challengeId, user) {

    if (!challengeId) {
      throw new Error("Challenge ID is required");
    }

    const challenge =
      await this.challengeRepository.findById(challengeId);

    if (user.role === "RECRUITER" &&
        challenge.createdBy !== user.userId) {
      throw new Error("Not authorized");
    }

    if (user.role === "CANDIDATE") {
      throw new Error("Candidates cannot view all assignments of a challenge");
    }

    return await this.assignmentRepository.findByChallenge(challengeId);
  }

  // ================= FIND BY CANDIDATE =================

  async findByCandidateId(candidateId, user) {

    if (!candidateId) {
      throw new Error("Candidate ID is required");
    }

    if (user.role === "CANDIDATE" &&
        candidateId !== user.userId) {
      throw new Error("Not authorized");
    }

    if (!["ADMIN", "RECRUITER", "CANDIDATE"].includes(user.role)) {
      throw new Error("Invalid role");
    }

    return await this.assignmentRepository.findByCandidate(candidateId);
  }

  // ================= UPDATE STATUS =================

  async updateStatus(id, action, user) {

    const assignment =
      await this.assignmentRepository.findById(id);

    const challenge =
      await this.challengeRepository.findById(assignment.challengeId);

    if (user.role === "CANDIDATE" &&
        assignment.candidateId !== user.userId) {
      throw new Error("Not authorized");
    }

    if (user.role === "RECRUITER" &&
        challenge.createdBy !== user.userId) {
      throw new Error("Not authorized");
    }

    switch (action) {
      case "start":
        assignment.start();
        break;

      case "submit":
        throw new Error("Submission must be created through SubmissionService");

      case "complete":
        assignment.markAsCompleted();
        break;

      case "expire":
        assignment.markAsExpired();
        break;

      default:
        throw new Error("Invalid action");
    }

    return await this.assignmentRepository.update(assignment);
  }
}