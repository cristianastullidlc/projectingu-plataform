import ChallengeNotFoundError from "../errors/ChallengeNotFoundError.js";
import InvalidCredentialsError from "../errors/InvalidCredentialsError.js";
import UnauthorizedActionError from "../errors/UnauthorizedActionError.js";
import SubmissionNotFoundError from "../errors/SubmissionNotFound.js";


export const SubmissionErrorMiddleware = (err, req, res, next) => {
    console.error("Error in challenge routes:", err);

    if (err instanceof ChallengeNotFoundError) {
        return res.status(404).json({ success: false, error: err.message });
    }
    
    if (err instanceof UnauthorizedActionError) {
        return res.status(403).json({ success: false, error: err.message });
    }

    if (err instanceof InvalidCredentialsError) {
        return res.status(401).json({ success: false, error: err.message });
    }

    if (err instanceof SubmissionNotFound) {
        return res.status(404).json({ success: false, error: err.message });
    }

    res.status(500).json({ error: "Internal Server Error" });
}