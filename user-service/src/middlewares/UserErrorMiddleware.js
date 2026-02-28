import UserNotFoundError from "../errors/UserNotFoundError.js";
import {IdentificationAlreadyExistsError} from "../errors/IdentificationAlreadyExistsError.js";

export const userErrorMiddleware = (err, req, res, next) => {
    console.error("Error in user routes:", err);

    if (err instanceof UserNotFoundError) {
        return res.status(404).json({ success: false, error: err.message });
    }
    
    if (err instanceof IdentificationAlreadyExistsError) {
        return res.status(409).json({ success: false, error: err.message });
    }

    res.status(500).json({ error: "Internal Server Error" });
}