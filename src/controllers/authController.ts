import allUsers from "../models/users.json";

const userDB = {
  "users": allUsers,
  "setUsers": function (data: any) {
    this.users = data;
  },
};

import fsPromises from "fs/promises";
import path from "path";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { ROLES } from "../config/roles_list";

dotenv.config();

const writeFile = async (data: USER[]) => {
  await fsPromises.writeFile(
    path.join(__dirname, "..", "models", "users.json"),
    JSON.stringify(data)
  );
};

export const userRegister = async (req: Request, res: Response) => {
  const { userName, password } = req.body;

  if (!userName || !password) {
    return res
      .status(400)
      .json({ "message": "Username and password are required" });
  }

  const dupUser = userDB?.users?.find(
    (person: USER) => person?.username === userName
  );

  if (dupUser)
    return res
      .status(409)
      .json({ "message": `Username ${userName} already exists` });

  try {
    const hashedPwd = await bcrypt.hash(password, 10);
    const userID = userDB?.users?.length;

    const newUser = {
      "id": userID,
      "username": userName,
      "roles": {
        "user": ROLES.user,
      },
      "password": hashedPwd,
    };

    userDB.setUsers([...userDB.users, newUser]);

    writeFile(userDB.users);

    res.status(201).json({ "success": `New user ${userName} created !` });
  } catch (error: any) {
    res.status(500).json({ "message": error.message });
  }
};

export const userLogin = async (req: Request, res: Response) => {
  const { userName, password } = req.body;

  if (!userName || !password) {
    return res
      .status(400)
      .json({ "message": "Username and password are required" });
  }

  const userFound = userDB.users.find(
    (user: USER) => user.username === userName
  );

  if (!userFound)
    return res
      .status(401)
      .json({ "message": `Could not find user with usernmae : ${userName}` });

  const match = await bcrypt.compare(password, userFound?.password);

  if (match) {
    const roles = Object.values(userFound.roles);
    const accessToken = jwt.sign(
      {
        "UserInfo": {
          "username": userFound?.username,
          "roles": roles,
        },
      },
      process.env.ACCESS_TOKEN_SECRET!,
      { expiresIn: "30s" }
    );

    const refreshToken = jwt.sign(
      { "username": userFound?.username },
      process.env.REFRESH_TOKEN_SECRET!,
      { expiresIn: "1d" }
    );

    const otherUser = userDB.users.filter(
      (person) => person.id !== userFound?.id
    );

    const currentUser = { ...userFound, refreshToken };

    userDB.setUsers([...otherUser, currentUser]);

    await writeFile(userDB.users);

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      "success": `Logged in as ${userName}`,
      "accessToken": accessToken,
    });
  } else {
    res.status(401).json({ "error": "Credentials do not match" });
  }
};

export const userLogout = (req: Request, res: Response) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) return res.sendStatus(204);

  const refreshToken = cookies?.jwt;
  const foundUser = userDB?.users?.find(
    (person) => person.refreshToken === refreshToken
  );

  if (!foundUser) {
    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });
    return res.sendStatus(204);
  }

  const outherUsers = userDB?.users?.filter(
    (user) => user.refreshToken !== refreshToken
  );

  const currentUser = { ...foundUser, refreshToken: "" };

  userDB?.setUsers([...outherUsers, currentUser]);

  writeFile(userDB?.users);

  res.clearCookie("jwt", { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });

  res.sendStatus(204);
};
