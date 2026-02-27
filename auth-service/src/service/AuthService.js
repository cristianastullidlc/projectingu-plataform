import InvalidCredentialsError from "../errors/InvalidCredentialsError.js"
import AuthProviderFactory from "../models/entities/AuthProviderFactory.js"
import {AuthUser} from "../models/entities/AuthUser.js";

export class AuthService {
    constructor(userRepository, tokenService) {
        this.userRepository = userRepository;
        this.tokenService = tokenService;
    }

    async login(email, password = null, providerId = null) {
        const user = await this.userRepository.findByEmail(email);

        if(!user) {
            throw new InvalidCredentialsError();
        }

        const provider = AuthProviderFactory.create(user.provider);


        const credentials = {email, password, providerId};

        const isValid = await provider.validate(
            credentials,
            user
        );

        if (!isValid) {
            throw new InvalidCredentialsError();
        }

        const token = this.tokenService.generate(user);

        return {accessToken: token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role
            }
        };
    }

    async register(email, password, role, providerType = "LOCAL", providerId = null) {

    const existing = await this.userRepository.findByEmail(email);

    const provider = AuthProviderFactory.create(providerType);

    const credentials = { email, password, providerId };

    const providerData = await provider.register(credentials);

    const user = new AuthUser(
        null,
        email,
        role,
        providerData.provider,
        providerData.password,
        providerData.providerId
    );

    const savedUser = await this.userRepository.create(user);

    return {
        id: savedUser.id,
        email: savedUser.email,
        role: savedUser.role
    };
}
}