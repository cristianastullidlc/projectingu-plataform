
export default class UserNotFoundError extends Error {
    constructor(id) {
        super(`Non existent user with id: "${id}"`);
        this.name = "UserNotFoundError";
    }
}