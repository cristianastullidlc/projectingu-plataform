import z from "zod";
import {Role} from "../models/enums/Role.js"

export class AuthController {
    constructor(authService) {
        this.authService = authService
    }

    async login(req, res) {
        const result = userLoginSchema.safeParse(req.body);
        if (!result.success) {
            return res
                .status(400)
                .json({ error: "Invalid login data", issues: result.error.issues });
        }

        const {email, password, providerId} = result.data;

        const data = await this.authService.login(email, password, providerId);

        res.status(200).json(data);
    }

    async register(req, res) {
        const result = userRegisterSchema.safeParse(req.body);

        if (!result.success) {
            return res
                .status(400)
                .json({ error: "Invalid registration data", issues: result.error.issues });
        }

        const {email, password, role} = result.data;

        const data = await this.authService.register(email, password, role);

        res.status(201).json({user: data});
    }
}

const userLoginSchema = z.object(
    {
        email: z.string().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
        password: z.string().min(6).optional(),
        providerId: z.string().min(10).optional()
    }
);

const userRegisterSchema = z.object(
    {
        email: z.string().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
        password: z.string().min(6).optional(),
        role: z.enum(Object.values(Role))
    }
);