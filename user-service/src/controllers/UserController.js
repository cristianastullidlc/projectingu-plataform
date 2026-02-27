
export default class UserController {
    constructor(userService) {
        this.userService = userService;
    }

    async createUser(req, res) {
        const { name, lastName, identification, email } = req.body;

        const userId = req.user.id;
        const role = req.user.role;

        try{
            const user = await this.userService.createUser({
                userId,
                name,
                lastName,
                identification,
                email,
                role
            });
            res.status(201).json(user);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async getUser(req, res) {
        const userId = req.user.id;
        try {
            const user = await this.userService.getProfileByUserId(userId);
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }
            res.status(200).json(user);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async deleteUser(req, res) {
        const userId = req.user.id;
        try {
            await this.userService.deleteUser(userId);
            res.status(204).send();
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async updateUser(req, res) {
        const userId = req.user.id;
        const { name, lastName, identification, email} = req.body;
        
        try {            
            const user = await this.userService.updateUser(
                userId,
                {name,
                lastName,
                identification,
                email
                }
            );

            res.status(200).json(user);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    //para admin
    async getUserById(req, res) {
        const { userId } = req.params;
        try {
            const user = await this.userService.getProfileByUserId(userId);
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }
            res.status(200).json(user);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

}