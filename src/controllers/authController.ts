import allUsers from "../models/users.json";

const userDB = {
  "users": allUsers,
  "setUsers": function (data: USER[]) {
    this.users = data;
  },
};

import fsPromises from "fs/promises";
import path from "path";
import { Request, Response } from "express";
import bcrypt from "bcrypt";

export const userRegister = async (req: Request, res: Response) => {
  const { userName, password } = req.body;

  if (!userName || !password) {
    return res
      .status(400)
      .json({ "message": "Username and password are required" });
  }

  const dupUser = userDB.users.find(
    (person: USER) => person.username === userName
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
      "password": hashedPwd,
    };

    userDB.setUsers([...userDB.users, newUser]);

    await fsPromises.writeFile(
      path.join(__dirname, "..", "models", "users.json"),
      JSON.stringify(userDB.users)
    );

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
    res.status(200).json({ "success": `Logged in as ${userName}` });
  } else {
    res.status(401).json({ "error": "Credentials do not match" });
  }
};
