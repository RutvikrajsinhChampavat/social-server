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

const writeFile = async (data: USER[]) => {
  await fsPromises.writeFile(
    path.join(__dirname, "..", "models", "users.json"),
    JSON.stringify(data)
  );
};

export const getUsers = (_: Request, res: Response) => {
  res.status(200).json({
    "message": "All users fetched successfully!",
    "data": userDB?.users,
  });
};

export const getUser = (req: Request, res: Response) => {
  const userID = parseInt(req.params.id, 10);

  const user = userDB?.users?.find((person) => person.id === userID);

  if (!user)
    return res.status(400).json({ "message": "User does not exists!" });

  res
    .status(200)
    .json({ "message": "User fetched successfully!", "data": user });
};

export const updateUser = async (req: Request, res: Response) => {
  const updateID = parseInt(req.params.id, 10);

  const existingUsername = userDB.users
    .filter((user) => user.id !== updateID)
    .find((user) => user.username === req.body.username);

  if (existingUsername)
    return res
      .status(401)
      .json({ "message": `User name ${req.body.username} is already taken` });

  const updateUser = userDB.users.find((person) => person.id === updateID);

  if (!updateUser) {
    return res.status(404).json({ "message": "Could not find requested user" });
  }

  if (updateUser.username === req.body.username)
    return res
      .status(400)
      .json({ "message": "You have entered the same user name" });

  if (req.body.username) {
    updateUser.username = req.body.username;
  }

  const filteredArr = userDB.users.filter((user) => user.id !== updateID);

  const unsortedArr = [...filteredArr, updateUser];

  userDB.setUsers(
    unsortedArr.sort((a, b) => (a.id > b.id ? 1 : a.id < b.id ? -1 : 0))
  );

  writeFile(userDB.users);

  res.status(200).json({ "message": "User updated", "data": userDB.users });
};

export const deleteUser = async (req: Request, res: Response) => {
  const deleteID = parseInt(req.params.id);

  const deleteUser = userDB.users.find((person) => person.id === deleteID);

  if (!deleteUser)
    return res.status(404).json({ "message": "Could not find requested user" });

  const updatedArr = userDB.users.filter((user) => user.id !== deleteID);

  userDB.setUsers(updatedArr);

  writeFile(userDB.users);

  res.status(200).json({
    "message": `User ${deleteUser.username} deleted successfully`,
    "data": userDB.users,
  });
};
