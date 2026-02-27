import express from "express";
import { Router } from "express";
import UserController from "../controllers/UserController";
import { verifyTokenMiddleware } from "../middlewares/VerifyTokenMiddleware";
import { authorizeRoles } from "../middlewares/authorizeRoles";
import tokenService from "../services/tokenService.js";

const basePath = "/user";

export default function userRoutes(getController) {
    const router = Router();

    router.use(
        basePath,
        verifyTokenMiddleware(tokenService)
    );

    router.get( 
        `${basePath}/me`,
        async (req, res, next) => {
            try {
                await getController(UserController).getUser(req, res);
            } catch (error) {
                next(error);
            }
        }
    );
    //esto no lo crearia el user, lo crea la empresa para el postulante
    router.post(
        `${basePath}`,
        authorizeRoles("admin", "company"),
        async (req, res, next) => {
            try {
                await getController(UserController).createUser(req, res);
            } catch (error) {
                console.error("Error in POST /user route:", error);
                next(error);
            }
        }
    );

    router.put(
        `${basePath}/me`,
        async(req, res, next) => {
            try {
                await getController(UserController).updateUser(req, res);
            } catch (error) {
                console.error("Error in PUT /user/me route:", error);
                next(error);
            }
        }
    );

    router.delete(
        `${basePath}/me`,
        async(req, res, next) => {
            try {
                await getController(UserController).deleteUser(req, res);
            } catch (error) {
                console.error("Error in DELETE /user/me route:", error);
                next(error);
            }
        }
    );

    router.get(
        `${basePath}/:userId`,
        verifyTokenMiddleware(tokenService),
        authorizeRoles("admin"),
        async(req, res, next) => {
            try {
                await getController(UserController).getUserById(req, res);
            } catch (error) {
                console.error("Error in GET /user/:userId route:", error);
                next(error);
            }
        }
    );

    return router;

}

