import { Router } from 'express';
import SubmissionController from '../controllers/SubmissionController.js';
import { authorizeRoles } from '../middlewares/authorizeRoles.js';

const submissionPath = '/submission';

export default function submissionRoutes(getController, authMiddleware) {
  const router = Router();

  router.use(
    submissionPath,
    authMiddleware
  );

  // ================= CREATE =================

  router.post(
    `${submissionPath}`,
    authorizeRoles('candidate'),
    async (req, res, next) => {
      try {
        await getController(SubmissionController).create(req, res, next);
      } catch (error) {
        console.error('Error in POST /submission route:', error);
        next(error);
      }
    }
  );

  // ================= GET BY ID =================

  router.get(
    `${submissionPath}/:id`,
    async (req, res, next) => {
      try {
        await getController(SubmissionController).getById(req, res, next);
      } catch (error) {
        console.error('Error in GET /submission/:id route:', error);
        next(error);
      }
    }
  );

  // ================= EVALUATE =================

  router.patch(
    `${submissionPath}/:id/evaluate`,
    authorizeRoles('admin', 'recruiter'),
    async (req, res, next) => {
      try {
        await getController(SubmissionController).evaluate(req, res, next);
      } catch (error) {
        console.error('Error in PATCH /submission/:id/evaluate route:', error);
        next(error);
      }
    }
  );

  return router;
}