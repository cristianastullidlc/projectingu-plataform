export default class ChallengeNotFoundError extends Error {
  constructor(challengeId) {
    super(`Challenge with ID ${challengeId} not found.`);
    this.name = "ChallengeNotFoundError";
    this.challengeId = challengeId;
  }
}