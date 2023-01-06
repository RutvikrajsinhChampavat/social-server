import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { User } from "../models/User";

dotenv.config();

export const userRegister = async (req: Request, res: Response) => {
  const { userName, fullName, password, avatar } = req.body;

  const whiteSpaceRegEx = /\s/g;

  if (whiteSpaceRegEx.test(userName))
    return res
      .status(400)
      .json({ "message": "User name should not contain any white spaces." });

  if (!userName || !password || !fullName)
    return res
      .status(400)
      .json({ "message": "Username and password are required" });

  try {
    const hashedPwd = await bcrypt.hash(password, 10);

    const accessToken = jwt.sign(
      {
        "UserInfo": {
          "username": userName,
          "roles": [2001],
        },
      },
      process.env.ACCESS_TOKEN_SECRET as string,
      { expiresIn: "30m" }
    );

    const refreshToken = jwt.sign(
      {
        "UserInfo": {
          "username": userName,
          "roles": [2001],
        },
      },
      process.env.REFRESH_TOKEN_SECRET as string,
      { expiresIn: "1d" }
    );

    const newUser = await User.create({
      "username": userName,
      "fullname": fullName,
      "password": hashedPwd,
      "avatar": avatar || null,
      "bio": null,
      "followercount": 0,
      "followingcount": 0,
      "postcount": 0,
      "refreshtoken": refreshToken,
    });

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "none",
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      "message": `New user ${newUser.username} created !`,
      "user": {
        "username": userName,
        "fullName": fullName,
        "password": hashedPwd,
        "avatar": avatar || null,
        "bio": null,
        "followerCount": 0,
        "followingCount": 0,
        "postcount": 0,
      },
      "accessToken": accessToken,
    });
  } catch (error: any) {
    if (error.code === 11000)
      error.message = `User name ${userName} already exists`;
    res.status(400).json({ "message": error.message });
  }
};

export const userLogin = async (req: Request, res: Response) => {
  const { userName, password } = req.body;

  if (!userName || !password) {
    return res
      .status(400)
      .json({ "message": "Username and password are required" });
  }

  const userFound = await User.findOne({ username: userName });

  if (!userFound)
    return res
      .status(401)
      .json({ "message": `Could not find user with usernmae : ${userName}` });

  const match = await bcrypt.compare(password, userFound.password);

  if (match) {
    const roles = Object.values(userFound.roles as object);
    const accessToken = jwt.sign(
      {
        "UserInfo": {
          "username": userFound?.username,
          "roles": roles,
        },
      },
      process.env.ACCESS_TOKEN_SECRET as string,
      { expiresIn: "30m" }
    );

    const refreshToken = jwt.sign(
      {
        "UserInfo": {
          "username": userFound?.username,
          "roles": roles,
        },
      },
      process.env.REFRESH_TOKEN_SECRET as string,
      { expiresIn: "1d" }
    );

    userFound.refreshtoken = refreshToken;

    await userFound.save();

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "none",
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
    });

    const resUser = {
      "username": userFound.username,
      "fullName": userFound.fullname,
      "avatar": userFound.avatar,
      "postCount": userFound.postcount,
      "followingCount": userFound.followingcount,
      "followersCount": userFound.followercount,
    };

    res.status(200).json({
      "message": `Logged in as ${userName}`,
      "user": resUser,
      "accessToken": accessToken,
    });
  } else {
    res.status(401).json({ "error": "Username and password do not match" });
  }
};

export const userLogout = async (req: Request, res: Response) => {
  const cookies = req.cookies;

  // if (!cookies?.jwt) return res.sendStatus(204);

  const refreshToken = cookies?.jwt;

  const foundUser = await User.findOne({ refreshtoken: refreshToken }).exec();

  if (!foundUser) {
    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: "none",
      secure: false,
    });

    return res.status(200).json({ "message": "Logged out successfully" });
  }

  foundUser.refreshtoken = "";

  await foundUser.save();

  res.clearCookie("jwt", {
    httpOnly: true,
    sameSite: "none",
    secure: false,
  });

  res.status(200).json({ "message": "Logged out successfully" });
};
