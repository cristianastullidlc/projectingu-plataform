import ChallengeRepositoryMapper from '../../utils/ChallengeRepositoryMapper.js';
import ChallengeNotFoundError from '../../errors/ChallengeNotFoundError.js';

export default class ChallengeRepository {
  constructor(model) {
    this.model = model;
  }

  async findById(id) {
    const document = await this.model.findById(id).lean();

    if (!document) {
      throw new ChallengeNotFoundError(id);
    }

    return ChallengeRepositoryMapper.toDomain(document);
  }

  async find(filter = {}) {
    const documents = await this.model
      .find(filter)
      .lean();

    return documents.map(doc =>
      ChallengeRepositoryMapper.toDomain(doc)
    );
  }

  async create(challenge) {
    const persistence =
      ChallengeRepositoryMapper.toPersistence(challenge);

    const created = await this.model.create(persistence);

    return ChallengeRepositoryMapper.toDomain(created.toObject());
  }

  async update(challenge) {
    const persistence =
      ChallengeRepositoryMapper.toPersistence(challenge);

    const updated = await this.model
      .findByIdAndUpdate(
        challenge.id,
        persistence,
        { new: true }
      )
      .lean();

    if (!updated) {
      throw new ChallengeNotFoundError(challenge.id);
    }

    return ChallengeRepositoryMapper.toDomain(updated);
  }

  async exists(id) {
    const count = await this.model.countDocuments({ _id: id });
    return count > 0;
  }
}