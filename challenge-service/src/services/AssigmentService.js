import RedundancyCreationError from "../errors/RedundancyCreationError.js";
import Assignment from "../model/entities/Assingment.js";
import UnauthizedError from "../errors/UnauthorizedActionError.js";
import ChallengeNotFoundError from "../errors/ChallengeNotFoundError.js";
import InvalidCredentialsError from "../errors/InvalidCredentialsError.js";

export default class AssignmentService {

  constructor(assignmentRepository, challengeRepository) {
    this.assignmentRepository = assignmentRepository;
    this.challengeRepository = challengeRepository;
  }


  async create(challengeId, candidateId, user, deadlineOverride) {

    if (!challengeId) throw new InvalidCredentialsError("Challenge ID is required");
    if (!candidateId) throw new InvalidCredentialsError("Candidate ID is required");

    if (!["ADMIN", "RECRUITER"].includes(user.role)) {
      throw new UnauthizedError();
    }

    const challenge = await this.challengeRepository.findById(challengeId);

    if (!challenge) {
      throw new ChallengeNotFoundError();
    }

    if (user.role === "RECRUITER" && challenge.createdBy !== user.userId) {
      throw new UnauthizedError();
    }

    const alreadyExists =
      await this.assignmentRepository.exists(candidateId, challengeId);

    if (alreadyExists) {
      throw new RedundancyCreationError();
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

    if (!id) throw new InvalidCredentialsError("ID is required");

    const assignment = await this.assignmentRepository.findById(id);

    const challenge =
      await this.challengeRepository.findById(assignment.challengeId);

    switch (user.role) {

      case "ADMIN":
        return assignment;

      case "RECRUITER":
        if (challenge.createdBy !== user.userId) {
          throw new UnauthizedError();
        }
        return assignment;

      case "CANDIDATE":
        if (assignment.candidateId !== user.userId) {
          throw new UnauthizedError();
        }
        return assignment;

      default:
        throw new UnauthizedError();
    }
  }

  // ================= FIND BY CHALLENGE =================

  async findByChallengeId(challengeId, user) {

    if (!challengeId) {
      throw new InvalidCredentialsError("Challenge ID is required");
    }

    const challenge =
      await this.challengeRepository.findById(challengeId);

    if (user.role === "RECRUITER" &&
        challenge.createdBy !== user.userId) {
      throw new UnauthizedError();
    }

    if (user.role === "CANDIDATE") {
      throw new UnauthizedError();
    }

    return await this.assignmentRepository.findByChallenge(challengeId);
  }

  // ================= FIND BY CANDIDATE =================

  async findByCandidateId(candidateId, user) {

    if (!candidateId) {
      throw new InvalidCredentialsError("Candidate ID is required");
    }

    if (user.role === "CANDIDATE" &&
        candidateId !== user.userId) {
      throw new UnauthizedError();
    }

    if (!["ADMIN", "RECRUITER", "CANDIDATE"].includes(user.role)) {
      throw new UnauthizedError();
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
      throw new UnauthizedError();
    }

    if (user.role === "RECRUITER" &&
        challenge.createdBy !== user.userId) {
      throw new UnauthizedError();
    }

    switch (action) {
      case "start":
        assignment.start();
        break;

      case "submit":
        throw new UnauthizedError();

      case "complete":
        assignment.markAsCompleted();
        break;

      case "expire":
        assignment.markAsExpired();
        break;

      default:
        throw new UnauthizedError();
    }

    return await this.assignmentRepository.update(assignment);
  }
}