import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { User } from "../models/User";

dotenv.config();

export const refreshToken = async (req: Request, res: Response) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) return res.sendStatus(401);

  const refreshToken = cookies?.jwt;

  const userFound = await User.findOne({ refreshtoken: refreshToken }).exec();

  if (!userFound)
    return res.status(403).json({ "message": "Forbidden request" });

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET as string,
    (err: any, decoded: any) => {
      if (err || decoded?.UserInfo?.username !== userFound?.username)
        return res.sendStatus(403).json({ "message": "Forbidden" });

      const roles = Object.values(userFound.roles as object);

      const accessToken = jwt.sign(
        {
          "UserInfo": {
            "username": userFound?.username,
            "roles": roles,
          },
        },
        process.env.ACCESS_TOKEN_SECRET as string,
        { expiresIn: "10m" }
      );

      res.status(200).json({ accessToken });
    }
  );
};
