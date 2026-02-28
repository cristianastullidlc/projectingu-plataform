import ChallengeNotFoundError from "../errors/ChallengeNotFoundError.js";
import UnauthorizedChallengeAccessError from "../errors/UnauthorizedChallengeAccessError.js";
import RepositoryError from "../errors/RepositoryError.js";

export const ChallengeErrorMiddleware = (err, req, res, next) => {
    console.error("Error in challenge routes:", err);

    if (err instanceof ChallengeNotFoundError) {
        return res.status(404).json({ success: false, error: err.message });
    }
    
    if (err instanceof UnauthorizedChallengeAccessError) {
        return res.status(403).json({ success: false, error: err.message });
    }

    if (err instanceof RepositoryError) {
        return res.status(500).json({ success: false, error: err.message });
    }

    if (err instanceof InvalidCredentialsError) {
        return res.status(401).json({ success: false, error: err.message });
    }

    res.status(500).json({ error: "Internal Server Error" });
}