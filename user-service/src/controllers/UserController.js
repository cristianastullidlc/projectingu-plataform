
export default class UserController {
    constructor(userService) {
        this.userService = userService;
    }

    async createUser(req, res) {
        const { name, lastName, identification } = req.body;

        const userId = req.user.userId;
        const role = req.user.role;
        const providerId = req.user.providerId;
        const email = req.user.email;

        try{
            const user = await this.userService.createUser({
                userId,
                name,
                lastName,
                identification,
                email,
                role,
                providerId
            });
            res.status(201).json(user);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async getUser(req, res) {
        const userId = req.user.userId;
        try {
            const user = await this.userService.getUserByUserId(userId);
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }
            res.status(200).json(user);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async deleteUser(req, res) {
        const userId = req.user.userId;
        try {
            await this.userService.deleteUser(userId);
            res.status(204).send();
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async updateUser(req, res) {
        const userId = req.user.userId;
        const { name, lastName} = req.body;


        try {            
            const user = await this.userService.updateUser(
                userId,
                {name,
                lastName,
                });

            res.status(200).json(user);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    //para admin
    async getUserById(req, res) {
        const { userId } = req.params;
        try {
            const user = await this.userService.getUserByUserId(userId);
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }
            res.status(200).json(user);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    
}