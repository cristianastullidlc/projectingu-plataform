import { fa } from "zod/locales";
import Challenge from "../model/entities/Challenge.js";

export default class ChallengeService {
    constructor(repository, assignmentRepository) {
        this.repository = repository;
        this.assignmentRepository = assignmentRepository;
    }

    async create(data, user) {
    if (!user) throw new Error("Authentication required");

    if (!["RECRUITER", "ADMIN"].includes(user.role)) {
      throw new Error("Unauthorized to create challenge");
    }

    const challenge = new Challenge({
      ...data,
      createdBy: user.userId,
      status: "draft"
    });

    return await this.repository.create(challenge);
  }

    async getById(id, user) {
    const challenge = await this.repository.findById(id);

    if (challenge.isDeleted && user.role !== "ADMIN") {
      throw new Error("Challenge not found");
    }

    if (user.role === "CANDIDATE") {
      if (challenge.status !== "published") {
        throw new Error("Not authorized to view this challenge");
      }

      const assigned = await this.assignmentRepository.exists(
        user.userId,
        challenge.id
      );

      if (!assigned) {
        throw new Error("Not authorized to view this challenge");
      }
    }

    if (user.role === "RECRUITER") {
      if (challenge.createdBy !== user.userId) {
        throw new Error("Not authorized");
      }
    }

    return challenge;
  }

    async getAll(filter, user) {

      let finalFilter = { ...filter };

      switch (user.role) {

        case "CANDIDATE":
          const assignedChallengeIds = 
          await this.assignmentRepository.findChallengeIdsByCandidate(user.userId);
          
          finalFilter._id = { $in: assignedChallengeIds };
          finalFilter.status = "published";
          finalFilter.isDeleted = false;

          break;

        case "RECRUITER":
          finalFilter.createdBy = user.userId;
          finalFilter.isDeleted = false;
          break;

        case "ADMIN":
          // Admin puede ver todo
          break;

        default:
          throw new Error("Invalid role");
      }

      return await this.repository.find(finalFilter);
  }

    async update(id, data, user) {
        const challenge = await this.repository.findById(id);

        if (challenge.isDeleted) {
        throw new Error("Cannot edit deleted challenge");
        }

        if (user.role !== "ADMIN") {
          challenge.validateOwnership(user.userId);
        }

        if (!challenge.isEditable()) {
        throw new Error("Challenge cannot be edited");
        }

        if (data.title) challenge.changeTitle(data.title);
        if (data.description) challenge.changeDescription(data.description);
        if (data.difficulty) challenge.changeDifficulty(data.difficulty);
        if (data.techStack) challenge.changeTechStack(data.techStack);
        if (data.deadline) challenge.changeDeadline(data.deadline);

        return await this.repository.update(challenge);
    }

    async publish(id, user) {
        const challenge = await this.repository.findById(id);

        if (user.role !== "ADMIN") {
          challenge.validateOwnership(user.userId);
        }

        challenge.publish();

        return await this.repository.update(challenge);
    }

    async close(id, user) {
        const challenge = await this.repository.findById(id);

        if (user.role !== "ADMIN") {
          challenge.validateOwnership(user.userId);
        }

        challenge.close();

        return await this.repository.update(challenge);
    }

    async delete(id, user) {
        const challenge = await this.repository.findById(id);

        if (user.role !== "ADMIN") {
          challenge.validateOwnership(user.userId);
        }
        
        challenge.markAsDeleted();

        await this.repository.update(challenge);
    }

    
}