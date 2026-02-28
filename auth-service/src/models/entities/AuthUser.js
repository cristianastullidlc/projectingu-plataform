import { Role } from "../enums/Role.js";

export class AuthUser {

    constructor(
        id,
        email,
        role,
        provider,
        password = null,
        providerId = null
    ) {

        // 🔹 Validación estructural

        if (!email || typeof email !== "string") {
            throw new Error("AuthUser: email is required and must be a string");
        }

        if (!role || !Object.values(Role).includes(role)) {
            throw new Error(`AuthUser: invalid role "${role}"`);
        }

        if (!provider || typeof provider !== "string") {
            throw new Error("AuthUser: provider must be a non-empty string");
        }

        // 🔹 Coherencia de autenticación

        const hasPassword = typeof password === "string" && password.length > 0;
        const hasProviderId = typeof providerId === "string" && providerId.length > 0;

        if (hasPassword && hasProviderId) {
            throw new Error("AuthUser: cannot have both password and providerId");
        }

        if (!hasPassword && !hasProviderId) {
            throw new Error("AuthUser: either password or providerId must be provided");
        }

        this.id = id;
        this.email = email;
        this.role = role;
        this.provider = provider;
        this.password = hasPassword ? password : null;
        this.providerId = hasProviderId ? providerId : null;
    }

    changeRole(role) {
        if (!Object.values(Role).includes(role)) {
            throw new Error(`AuthUser: invalid role "${role}"`);
        }
        this.role = role;
    }

    hasRole(role) {
        return this.role === role;
    }

    isRecruiter() {
        return this.hasRole(Role.Recruiter);
    }

    isCandidate() {
        return this.hasRole(Role.Candidate);
    }

    isAdmin() {
        return this.hasRole(Role.Admin);
    }

    isLocal() {
        return !!this.password;
    }

    isExternal() {
        return !!this.providerId;
    }
}