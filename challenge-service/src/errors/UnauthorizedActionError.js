
export default class UnauthorizedActionError extends Error {
    constructor() {
        super("You are not authorized to perform this action.");
        this.name = 'UnauthorizedActionError';
    }
}