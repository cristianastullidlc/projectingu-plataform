import dotenv from 'dotenv';
import { Server } from './Server.js';
import { UserController } from './controllers/UserController.js';
import { UserRepository } from './models/repositories/UserRepository.js';
import { UserService } from './service/UserService.js';
import userRoutes from './routes/UserRoutes.js';
import { MongoDbClient } from './infrastructure/database/MongoDbClient.js';
import { UserModel } from './infrastructure/database/schemas/UserSchema.js';

dotenv.config();

const PORT = process.env.PORT || 3001;

const server = new Server(PORT);

