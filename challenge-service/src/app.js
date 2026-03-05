import dotenv from 'dotenv';
import { Server } from './Server.js';
import ChallengeController from './controllers/ChallengeController.js';
import ChallengeRepository from './model/repositories/ChallengeRepository.js';
import ChallengeService from './services/ChallengeService.js';
import {AssignmentRepository} from './model/repositories/AssigmentRepository.js';
import AssignmentService from './services/AssigmentService.js';
import AssignmentController from './controllers/AssigmentController.js';
import SubmissionRepository from './model/repositories/SubmissionRepository.js';
import SubmissionService from './services/SubmissionService.js';
import SubmissionController from './controllers/SubmissionController.js';
import Routes from './routes/Routes.js';
import { MongoDbClient } from './infrastructure/database//MongoDbClient.js';
import { ChallengeModel } from './infrastructure/database/schemas/ChallengeSchema.js';
import { verifyTokenMiddleware } from './middlewares/verifyTokenMiddleware.js';
import TokenService from './services/TokenService.js';
import {AssignmentModel} from "./infrastructure/database/schemas/AssigmentSchema.js";
import {SubmissionModel} from "./infrastructure/database/schemas/SubmissionSchema.js";


dotenv.config();


const PORT = process.env.PORT || 3002;

const server = new Server(PORT);

const challengeRepository = new ChallengeRepository(ChallengeModel);
const challengeService = new ChallengeService(challengeRepository);
const challengeController = new ChallengeController(challengeService);
server.setController(ChallengeController, challengeController);

const assignmentRepository = new AssignmentRepository(AssignmentModel);
const assignmentService = new AssignmentService(assignmentRepository, challengeRepository);
const assignmentController = new AssignmentController(assignmentService);
server.setController(AssignmentController, assignmentController);

const submissionRepository = new SubmissionRepository(SubmissionModel);
const submissionService = new SubmissionService(submissionRepository, assignmentRepository);
const submissionController = new SubmissionController(submissionService);
server.setController(SubmissionController, submissionController);

const tokenService = new TokenService(process.env.JWT_SECRET, process.env.JWT_EXPIRES_IN);
const authMiddleware = verifyTokenMiddleware(tokenService);

Routes.forEach(route =>
  server.addRoute((getController) =>
    route(getController, authMiddleware)
  )
);

server.configureRoutes();

await MongoDbClient.connect();

server.launch();