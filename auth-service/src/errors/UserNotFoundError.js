export default class UserNotFoundError extends Error {
    constructor(email) {
        super(`Non existent user with email: "${email}"`);
        this.name = "UserNotFoudError";
    }
}