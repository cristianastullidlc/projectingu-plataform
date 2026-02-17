import InvalidCredentialsError from "../errors/InvalidCredentialsError.js"
import AuthProviderFactory from "../models/entities/AuthProviderFactory.js"

export class AuthService {
    constructor(userRepository, tokenService) {
        this.userRepository = userRepository;
        this.tokenService = tokenService;
    }

    async login(email, password = null, providerId = null) {
        const user = await this.userRepository.findByEmail(email);

        if(!user) {
            throw new UserNotFoundError(email);
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

        return {accessToken: token};
    }

    async registerLocal(email, password, role) {

        const existing = await this.userRepository.findByEmail(email);

        if (existing) {
            throw new EmailAlreadyExistsError(email);
        }

        const credentials = {email, password};

        const providerData = await provider.register(credentials);

        const user = new AuthUser(
            null,
            email,
            role,
            providerData.provider,
            providerData.password,
            providerData.providerId
        );

        return await this.userRepository.create(user);
    }
}