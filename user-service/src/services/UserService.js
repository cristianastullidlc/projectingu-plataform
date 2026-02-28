import User from "../models/entities/User.js";


export default class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async createUser(
        {userId,
        name,
        lastName,
        identification,
        email,
        role,
        providerId}
    ) {
        if (!userId) throw new Error("UserId is required");
        if (!name) throw new Error("Name is required");
        if (!email) throw new Error("Email is required");
        if (!providerId) throw new Error("ProviderId is required");

        const existingUser = await this.userRepository.findByUserId(userId);
        if (existingUser) {
            throw new Error("Profile already exists for this user");
        }

        const user = new User({
            userId,
            name,
            lastName,
            identification,
            email,
            role,
            providerId
        });

        return this.userRepository.createUser(user);
    }

    async  getUserByUserId(userId) {
        const user = await this.userRepository.findByUserId(userId);
        if (!user) {
            throw new UserNotFoundError("User not found");
        }
        return user;
    }

    async deleteUser(userId) {
        const user = await this.userRepository.findByUserId(userId);
        if (!user) {
            throw new UserNotFoundError("User not found");
        }

        return this.userRepository.deleteUser(userId);
    }

    async updateUser(userId, updates) {
        const user = await this.userRepository.findByUserId(userId);
        if (!user) {
            throw new UserNotFoundError("User not found");
        }

        if (updates.name) user.changeName(updates.name);
        if (updates.lastName) user.changeLastName(updates.lastName);

        return this.userRepository.updateUser(user);
    }

}