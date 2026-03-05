import { Router } from 'express';
import ChallengeController from '../controllers/ChallengeController.js';
import { authorizeRoles } from '../middlewares/authorizeRoles.js';

const challengePath = '/challenge';

export default function challengeRoutes(getController, authMiddleware) {
  const router = Router();

  router.use(
    challengePath,
    authMiddleware
  );

  router.post(
    `${challengePath}`,
    authorizeRoles('admin', 'recruiter'),
    async (req, res, next) => {
      try {
        await getController(ChallengeController).create(req, res, next);
      } catch (error) {
        console.error('Error in POST /challenge route:', error);
        next(error);
      }
    }
  );

    router.get(
    `${challengePath}/:id`,
    async (req, res, next) => {
      try {
        await getController(ChallengeController).getById(req, res, next);
      } catch (error) {
        console.error('Error in GET /challenge/:id route:', error);
        next(error);
      }
    }
  );

  router.get(
    `${challengePath}`,
    async (req, res, next) => {
      try {
        await getController(ChallengeController).getAll(req, res, next);
      } catch (error) {
        console.error('Error in GET /challenge route:', error);
        next(error);
      }
    }
  );
  
  router.post(
    `${challengePath}/:id/publish`,
    authorizeRoles('admin', 'recruiter'),
    async (req, res, next) => {
      try {
        await getController(ChallengeController).publish(req, res, next);
      } catch (error) {
        console.error('Error in POST /challenge/:id/publish route:', error);
        next(error);
      }
    }
  );

  router.post(
    `${challengePath}/:id/close`,
    authorizeRoles('admin', 'recruiter'),
    async (req, res, next) => {
      try {
        await getController(ChallengeController).close(req, res, next);
      } catch (error) {
        console.error('Error in POST /challenge/:id/close route:', error);
        next(error);
      }
    }
  );
  
  router.post(
    `${challengePath}/:id/delete`,
    authorizeRoles('admin', 'recruiter'),
    async (req, res, next) => {
      try {
        await getController(ChallengeController).delete(req, res, next);
      } catch (error) {
        console.error('Error in POST /challenge/:id/delete route:', error);
        next(error);
      }
    }
  );

  router.put(
    `${challengePath}/:id`,
    authorizeRoles('admin', 'recruiter'),
    async (req, res, next) => {
      try {
        await getController(ChallengeController).update(req, res, next);
      } catch (error) {
        console.error('Error in PUT /challenge/:id route:', error);
        next(error);
      }
    }
  );

  return router;

}