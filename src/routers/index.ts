import express from "express";
import { loginDriver, registerDriver } from "../controllers/AuthController";
const appRouter = express.Router();

appRouter.post("/register-driver", registerDriver);
appRouter.post("/login-driver",loginDriver);
export default appRouter;