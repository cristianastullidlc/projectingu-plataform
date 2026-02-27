import InvalidCredentialsError from "../errors/InvalidCredentialsError.js"
import UserNotFoundError from "../errors/UserNotFoundError.js"
import {EmailAlreadyExistsError} from "../errors/EmailAlreadyExistsError.js"

export function authErrorMiddleware(err, req, res, next) {
    console.error("Auth error:", err);

    if (err instanceof InvalidCredentialsError) {
        return res.status(401).json({ success: false, error: err.message });
    }

    if (err instanceof UserNotFoundError) {
        return res.status(404).json({ success: false, error: err.message });
    }

    if (err instanceof EmailAlreadyExistsError) {
        return res.status(409).json({ success: false, error: err.message });
    }

    res.status(500).json({
        success: false,
        error: "Internal server error"
    });
}