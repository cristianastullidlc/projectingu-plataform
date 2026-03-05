import { Router } from 'express';
import AssignmentController from '../controllers/AssigmentController.js';
import { authorizeRoles } from '../middlewares/authorizeRoles.js';

const assignmentPath = '/assignment';

export default function assignmentRoutes(getController, authMiddleware) {
  const router = Router();

  router.use(
    assignmentPath,
    authMiddleware
  );

  // ================= CREATE =================

  router.post(
    `${assignmentPath}`,
    authorizeRoles('admin', 'recruiter'),
    async (req, res, next) => {
      try {
        await getController(AssignmentController).create(req, res, next);
      } catch (error) {
        console.error('Error in POST /assignment route:', error);
        next(error);
      }
    }
  );

  // ================= GET BY ID =================

  router.get(
    `${assignmentPath}/:id`,
    async (req, res, next) => {
      try {
        await getController(AssignmentController).getById(req, res, next);
      } catch (error) {
        console.error('Error in GET /assignment/:id route:', error);
        next(error);
      }
    }
  );

  // ================= GET BY CHALLENGE =================

  router.get(
    `${assignmentPath}/challenge/:challengeId`,
    authorizeRoles('admin', 'recruiter'),
    async (req, res, next) => {
      try {
        await getController(AssignmentController).getByChallenge(req, res, next);
      } catch (error) {
        console.error('Error in GET /assignment/challenge/:challengeId route:', error);
        next(error);
      }
    }
  );

  // ================= GET BY CANDIDATE =================

  router.get(
    `${assignmentPath}/candidate/:candidateId`,
    async (req, res, next) => {
      try {
        await getController(AssignmentController).getByCandidate(req, res, next);
      } catch (error) {
        console.error('Error in GET /assignment/candidate/:candidateId route:', error);
        next(error);
      }
    }
  );

  // ================= UPDATE STATUS =================

  router.patch(
    `${assignmentPath}/:id/status`,
    async (req, res, next) => {
      try {
        await getController(AssignmentController).updateStatus(req, res, next);
      } catch (error) {
        console.error('Error in PATCH /assignment/:id/status route:', error);
        next(error);
      }
    }
  );

  return router;
}