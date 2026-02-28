import dotenv from 'dotenv';
import { Server } from './Server.js';
import UserController from './controllers/UserController.js';
import UserRepository from './models/repositories/UserRepository.js';
import UserService from './services/UserService.js';
import userRoutes from './routers/UserRoutes.js';
import { MongoDbClient } from './infrastructure/database/MongoDbClient.js';
import { UserModel } from './infrastructure/schemas/UserSchema.js';
import TokenService from './services/TokenService.js';
import { verifyTokenMiddleware } from './middlewares/verifyTokenMiddleware.js';

dotenv.config();

const PORT = process.env.PORT || 3001;

const server = new Server(PORT);

const userRepository = new UserRepository(UserModel);

const userService = new UserService(userRepository);

const userController = new UserController(userService);

server.setController(UserController, userController);

const tokenService = new TokenService(process.env.JWT_SECRET, process.env.JWT_EXPIRES_IN);
const authMiddleware = verifyTokenMiddleware(tokenService);

server.addRoute((getController) =>
  userRoutes(getController, authMiddleware)
);

server.configureRoutes();  

(async () => {
    await MongoDbClient.connect();
    server.launch();
})();