import User from '../models/entities/User.js';

export class UserMapper {

  static toDomain(document) {
    if (!document) return null;

    return new User({
    userId: document.userId,
    name: document.name,
    lastName: document.lastName,
    identification: document.identification,
    email: document.email,
    role: document.role,
    providerId: document.providerId
  });
  }

  static toPersistence(user) {
    return {
        name: user.name,
        lastName: user.lastName,
        identification: user.identification,
        email: user.email,
        role: user.role,
        providerId: user.providerId
    };
  }
}