export default class RepositoryError extends Error {
    constructor() {
    super();
    this.message =
      "Credenciales inválidas. Por favor, verifica los datos ingresados.";
  }
}