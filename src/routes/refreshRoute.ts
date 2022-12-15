import express from "express";
import { refreshToken } from "../controllers/refreshTokenController";

const refreshRouter = express.Router();

refreshRouter.get("/", refreshToken);

export default refreshRouter;
