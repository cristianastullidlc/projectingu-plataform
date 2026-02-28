export class IdentificationAlreadyExistsError extends Error {
  constructor(identification) {
    super(`Identification "${identification}" already exists`);
    this.name = "IdentificacionAlreadyExistsError";
  }
}