import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";

dotenv.config();

interface CustomRequest extends Request {
  username?: string | JwtPayload;
  roles?: string;
}

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
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!, (err, decoded: any) => {
      if (err) return res.status(403).json({ "message": err.message });

      req.username = decoded?.UserInfo?.username;
      req.roles = decoded?.UserInfo?.roles;
      next();
    });
  }
};
