import { RepositoryError } from "../../errors/RepositoryError.js";
import { UserMapper } from "../../utils/UserMapper.js";

export default class UserRepository {
  constructor(model) {
    this.model = model;
  }

  async findByUserId(userId) {
    const document = await this.model.findOne({ userId }).lean();
    return UserMapper.toDomain(document);
  }

  async createUser(user) {
    const created = await this.model.create(
      UserMapper.toPersistence(user)
    );

    return UserMapper.toDomain(created.toObject());
  }

  async updateUser(user) {
    try {
      if (!user.userId) {
        throw new Error("User must have a userId to be updated");
      }

      const persistence = UserMapper.toPersistence(user);

      const updated = await this.model
        .findOneAndUpdate({ userId: user.userId }, persistence, { new: true })
        .lean();

      if (!updated) return null;

      return UserMapper.toDomain(updated);
    } catch (error) {
      throw new RepositoryError("Unexpected database error");
    }
  }

  async deleteUser(userId) {
    const deleted = await this.model.findOneAndDelete({ userId }).lean();
    return deleted ? UserMapper.toDomain(deleted) : null;
  }
}