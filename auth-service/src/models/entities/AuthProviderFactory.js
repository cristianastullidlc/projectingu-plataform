import { LocalAuthProvider } from "./LocalAuthProvider.js";

export default class AuthProviderFactory {

  static create(providerType) {

    switch (providerType) {
      case "LOCAL":
        return new LocalAuthProvider();
/*
      case "GOOGLE":
        return new GoogleAuthProvider();
*/
      default:
        throw new Error(`Unsupported provider type: ${providerType}`);
    }
  }
}