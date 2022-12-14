import express from "express";
import { userLogin, userRegister } from "../controllers/authController";

const authRouter = express.Router();

authRouter.post("/register", userRegister);
authRouter.post("/login", userLogin);

export default authRouter;
