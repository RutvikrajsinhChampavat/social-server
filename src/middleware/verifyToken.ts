import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Response, NextFunction } from "express";
import { CustomRequest } from "../models/types";

dotenv.config();

export const verifyToken = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"] || req.headers.authorization;

  if (!authHeader?.startsWith("Bearer "))
    return res.status(401).json({ "message": "Authorization token not found" });

  const token = authHeader?.split(" ")[1];

  if (token) {
    jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET as string,
      (err, decoded: any) => {
        if (err) return res.status(403).json({ "message": err.message });

        req.username = decoded?.UserInfo?.username;
        req.roles = decoded?.UserInfo?.roles;
        next();
      }
    );
  }
};
