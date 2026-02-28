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

    verify(token) {
        try {
            return jwt.verify(token, this.secret);
        } catch (err) {
            throw new InvalidCredentialsError();
        }
    }
}