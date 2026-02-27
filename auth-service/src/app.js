import dotenv from "dotenv";
import { Server } from "./Server.js";
import { AuthController } from "./controllers/AuthController.js";
import {AuthUserRepository} from "./models/repositories/AuthUserRepository.js";
import { AuthService } from "./service/AuthService.js";
import TokenService from "./service/TokenService.js";
import authRoutes from "./routes/AuthRoutes.js";
import { MongoDbClient } from "./infrastructure/database/MongoDbClient.js";
import {AuthUserModel} from "./infrastructure/database/schemas/AuthUserSchema.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

const server = new Server(PORT);

const authRepository = new AuthUserRepository(AuthUserModel);

const tokenService = new TokenService(
    process.env.JWT_SECRET, process.env.JWT_EXPIRES
);

const authService = new AuthService(authRepository, tokenService);

const authController = new AuthController(authService);

server.setController(AuthController, authController);

server.addRoute(authRoutes);

server.configureRoutes();

(async () => {
        await MongoDbClient.connect();
        server.launch();
    })();