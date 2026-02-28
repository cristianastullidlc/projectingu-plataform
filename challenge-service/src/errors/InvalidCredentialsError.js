export default class InvalidCredentialsError extends Error {
    constructor(message = "Invalid credentials provided") {
        super(message);
        this.name = "InvalidCredentialsError";
    }
}