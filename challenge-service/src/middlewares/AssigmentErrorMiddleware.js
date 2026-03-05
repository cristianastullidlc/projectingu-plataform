import ChallengeNotFoundError from "../errors/ChallengeNotFoundError.js";
import InvalidCredentialsError from "../errors/InvalidCredentialsError.js";
import RedundancyCreationError from "../errors/RedundancyCreationError.js";
import {RepositoryError} from "..//errors/RespotirotyError.js";
import UnauthorizedActionError from "../errors/UnauthorizedActionError.js";

export const AssigmentErrorMiddleware = (err, req, res, next) => {
    console.error("Error in challenge routes:", err);

    if (err instanceof ChallengeNotFoundError) {
        return res.status(404).json({ success: false, error: err.message });
    }
    
    if (err instanceof UnauthorizedActionError) {
        return res.status(403).json({ success: false, error: err.message });
    }

    if (err instanceof RepositoryError) {
        return res.status(500).json({ success: false, error: err.message });
    }

    if (err instanceof InvalidCredentialsError) {
        return res.status(401).json({ success: false, error: err.message });
    }

    if (err instanceof RedundancyCreationError) {
        return res.status(409).json({ success: false, error: err.message });
    }

    res.status(500).json({ error: "Internal Server Error" });
}