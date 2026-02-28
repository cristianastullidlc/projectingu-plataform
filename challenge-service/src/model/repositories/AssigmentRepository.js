import { AssignmentRepositoryMapper } from "../../utils/AssigmentRepositoryMapper.js";
import Assignment from "../entities/Assingment.js";
import RepositoryError from "../../errors/RespotirotyError.js";
import AssignmentNotFoundError from "../../errors/AssigmentNotFound.js";

export class AssignmentRepository {

    constructor(model) {
        this.model = model;
    }

    async findChallengeIdsByCandidate(candidateId) {
        const assignments = await this.model
        .find({ candidateId })
        .lean();

        return assignments.map(a => a.challengeId);
    }

    async create(assignment) {
        if (!assignment) {
            throw new RepositoryError("Assignment is required");
        }

        const persistenceData = AssignmentRepositoryMapper.toPersistence(assignment);

        const created = await this.model.create(persistenceData);

        return AssignmentRepositoryMapper.toDomain(created);
    }

    async findById(id) {
        if (!id) {
            throw new RepositoryError("ID is required");
        }

        const document = await this.model.findById(id).lean();

        if (!document) {
            throw new AssignmentNotFoundError(id);
        }

        return AssignmentRepositoryMapper.toDomain(document);
    }

    findByChallengeId(challengeId) {
        if (!challengeId) {
            throw new RepositoryError("Challenge ID is required");
        }

        return this.model
        .find({ challengeId })
        .lean()
        .then(documents => documents.map(AssignmentRepositoryMapper.toDomain));
    }

    findByCandidateId(candidateId) {
        if (!candidateId) {
            throw new RepositoryError("Candidate ID is required");
        }

        return this.model
        .find({ candidateId })
        .lean()
        .then(documents => documents.map(AssignmentRepositoryMapper.toDomain));
    }

    async findByCandidateAndChallenge(candidateId, challengeId) {
        const document = await this.model
        .findOne({ candidateId, challengeId })
        .lean();

        if (!document) return null;

        return AssignmentRepositoryMapper.toDomain(document);
    }

    async update(assignment) {
        if (!assignment || !assignment.id) {
            throw new RepositoryError("Assignment with valid ID is required");
        }

        const persistenceData = AssignmentRepositoryMapper.toPersistence(assignment);

        const updated = await this.model
        .findByIdAndUpdate(
            assignment.id,
            persistenceData,
            { new: true }
        )
        .lean();

        if (!updated) {
            throw new AssignmentNotFoundError(assignment.id);
        }

        return AssignmentRepositoryMapper.toDomain(updated);
    }

    async exists(candidateId, challengeId) {
        const count = await this.model.countDocuments({
        candidateId,
        challengeId
        });

        return count > 0;
    }

    async delete(id) {
        const deleted = await this.model.findByIdAndDelete(id);

        if (!deleted) {
        throw new AssignmentNotFoundError(id);
        }
    }
}