import Challenge from '../model/entities/Challenge.js';

export default class ChallengeRepositoryMapper {

  static toDomain(document) {
    if (!document) return null;

    return new Challenge({
      id: document._id ? document._id.toString() : document.id ?? null,
      title: document.title,
      description: document.description,
      difficulty: document.difficulty,
      techStack: document.techStack ?? [],
      createdBy: document.createdBy,
      status: document.status,
      deadline: document.deadline,
      isDeleted: document.isDeleted ?? false,
      deletedAt: document.deletedAt ?? null,
      createdAt: document.createdAt,
      lastUpdatedAt: document.lastUpdatedAt
    });
  }

  static toPersistence(challenge) {
    return {
      title: challenge.title,
      description: challenge.description,
      difficulty: challenge.difficulty,
      techStack: challenge.techStack,
      createdBy: challenge.createdBy,
      status: challenge.status,
      deadline: challenge.deadline,
      isDeleted: challenge.isDeleted,
      deletedAt: challenge.deletedAt,
      createdAt: challenge.createdAt,
      lastUpdatedAt: challenge.lastUpdatedAt
    };
  }
}