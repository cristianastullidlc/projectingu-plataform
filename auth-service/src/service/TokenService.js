import jwt from "jsonwebtoken";
import InvalidCredentialsError from "../errors/InvalidCredentialsError.js";

export default class TokenService {
    constructor(secret, expiresIn = "1h") {
        if (!secret) {
            throw new Error("JWT_SECRET is not defined in environment variables");
        }
        this.secret = secret;
        this.expiresIn = expiresIn;
    }

    generate(user) {
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
            provider: user.provider
        };

        return jwt.sign(
            payload, this.secret, { expiresIn: this.expiresIn }
        );
    }

    verify(token) {
        try {
            return jwt.verify(token, this.secret);
        } catch (err) {
            throw new InvalidCredentialsError();
        }
    }
}