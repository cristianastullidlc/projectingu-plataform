import { AuthUserMapper } from "../../utils/AuthUserMapper.js";
import {RepositoryError } from "../../errors/RepositoryError.js";
import { EmailAlreadyExistsError } from "../../errors/EmailAlreadyExistsError.js";

export class AuthUserRepository {
    constructor(model) {
        this.model = model;
    }

    async findById(id) {
        const user = await this.model.findById(id).lean();
        
        if(!user) return null;

        return AuthUserMapper.toDomain(user);
    }

    async findByEmail(email) {
        const user = await this.model.findOne({ email }).lean();

        if(!user) return null;

        return AuthUserMapper.toDomain(user);
    }

    async create(authUser) {
        try {
            const persistence = AuthUserMapper.toPersistence(authUser);
            const created = await this.model.create(persistence);

            return AuthUserMapper.toDomain(created.toObject());

        } catch (error) {

            if (error.code === 11000) {
            throw new EmailAlreadyExistsError(authUser.email);
            }

            throw new RepositoryError("Unexpected database error");
        }
    }

    async update(authUser) {
        try {
            if (!authUser.id) {
                throw new Error("AuthUser must have an id to be updated");
            }

            const persistence = AuthUserMapper.toPersistence(authUser);

            const updated = await this.model.findByIdAndUpdate(
                authUser.id,
                persistence,
                { new: true }
                ).lean();

            if (!updated) return null;

            return AuthUserMapper.toDomain(updated);

        } catch (error) {

            // 🔹 Duplicate key (email único)
            if (error.code === 11000) {
                throw new EmailAlreadyExistsError(authUser.email);
            }

            // 🔹 Error inesperado de base
            throw new RepositoryError("Failed to update AuthUser");
        }
    }
}