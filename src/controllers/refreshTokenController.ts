import allUsers from "../models/users.json";

const userDB = {
  "users": allUsers,
  "setUsers": function (data: USER[]) {
    this.users = data;
  },
};

import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const refreshToken = (req: Request, res: Response) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) return res.sendStatus(401);

  const refreshToken = cookies?.jwt;
  console.log("refreshToken", refreshToken);
  console.log("userDB", userDB.users[2]);

  const userFound = userDB?.users?.find(
    (user: USER) => user?.refreshToken === refreshToken
  );

  if (!userFound)
    return res.status(403).json({ "message": "Forbidden request" });

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET!,
    (err: any, decoded: any) => {
      if (err || decoded.username !== userFound.username)
        res.sendStatus(403).json({ "message": "Forbidden" });

      const accessToken = jwt.sign(
        { "username": decoded.username },
        process.env.ACCESS_TOKEN_SERET!,
        { expiresIn: "30s" }
      );

      res.json({ accessToken });
    }
  );
};
