import { RepositoryError } from "../../errors/RepositoryError.js";
import { AuthUserMapper } from "../../utils/AuthUserMapper.js";

export default class UserRepository {
  constructor(model) {
    this.model = model;
  }

  findById(userId) {
    return this.model.findById(userId).lean();
  }

  create(user) {
    return this.model.create(user);
  }

  update(user) {
    try {
      if (!user.userId) {
        throw new Error("User must have a userId to be updated");
      }

      const persistence = AuthUserMapper.toPersistence(user);

      const updated = this.model
        .findByIdAndUpdate(user.userId, persistence, { new: true })
        .lean();

      if (!updated) return null;

      return AuthUserMapper.toDomain(updated);
    } catch (error) {
      throw new RepositoryError("Unexpected database error");
    }
  }

  delete(userId) {
    return this.model.findByIdAndDelete(userId);
  }
}