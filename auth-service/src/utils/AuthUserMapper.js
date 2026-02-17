import { AuthUser } from "../models/entities/AuthUser.js";

export class AuthUserMapper {

  static toDomain(document) {
    if (!document) return null;

    return new AuthUser(
      document._id?.toString(),
      document.email,
      document.role,
      document.provider,
      document.password,
      document.providerId
    );
  }

  static toPersistence(authUser) {
    return {
      email: authUser.email,
      role: authUser.role,
      provider: authUser.provider,
      password: authUser.password,
      providerId: authUser.providerId
    };
  }
}