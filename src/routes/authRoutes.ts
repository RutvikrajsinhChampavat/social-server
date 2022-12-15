import express from "express";
import {
  userLogin,
  userLogout,
  userRegister,
} from "../controllers/authController";

const authRouter = express.Router();

authRouter.post("/register", userRegister);
authRouter.post("/login", userLogin);
authRouter.get("/logout", userLogout);

export default authRouter;
