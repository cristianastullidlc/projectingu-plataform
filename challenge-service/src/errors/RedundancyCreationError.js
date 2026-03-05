export default class RedundancyCreationError extends Error {
    constructor() {
        super("An assignment for this candidate and challenge already exists.");
        this.name = 'RedundancyCreationError';
    }
}