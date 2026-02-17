import bcrypt from "bcrypt";


export class LocalAuthProvider {
    async validate(credentials, user) {
        if (!credentials.password || !user.password) {
            return false;
        }

        return await bcrypt.compare(
            credentials.password,
            user.password
        );
    }

    async register(credentials) {
        if (!credentials?.password) {
            throw new InvalidPasswordError("Password is required for LOCAL registration");
        }

        const hashedPassword = await bcrypt.hash(credentials.password, 10);

        return {
            provider: "LOCAL",
            password: hashedPassword,
            providerId: null
        };
    }
}