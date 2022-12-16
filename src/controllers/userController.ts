import { Request, Response } from "express";
import { CustomRequest } from "../models/types";
import { User } from "../models/User";

export const getUsers = async (_: Request, res: Response) => {
  const users = await User.find();

  res
    .status(200)
    .json({ "message": "Fetched all users successfully", "data": users });
};

export const getUser = async (req: Request, res: Response) => {
  const username = req.params.username;

  const user = await User.findOne({ "username": username });

  if (!user)
    return res
      .status(400)
      .json({ "message": `Could not find user with ${username} username` });

  res
    .status(200)
    .json({ "message": "User fetched successfully!", "data": user });
};

export const updateUser = async (req: CustomRequest, res: Response) => {
  const requestedUsername = req.body.username;
  const username = req.username;

  const updateUser = await User.findOne({
    "username": username,
  }).exec();

  if (!updateUser) {
    return res.status(404).json({
      "message": `Could not find user with ${username} username`,
    });
  }

  if (updateUser.username !== username)
    return res.status(401).json({ "message": "Forbidden request" });

  // check if existing user name and requested user name are same
  if (requestedUsername === username)
    return res
      .status(400)
      .json({ "message": "You have entered the same user name" });

  // check if requested user name exists
  const existingUsername = await User.findOne({
    "username": requestedUsername,
  }).exec();

  if (existingUsername)
    return res
      .status(401)
      .json({ "message": `User name ${requestedUsername} is already taken` });

  updateUser.username = requestedUsername;

  await updateUser.save();

  res
    .status(200)
    .json({ "message": "User updated successfully!", "data": updateUser });
};

export const deleteUser = async (req: CustomRequest, res: Response) => {
  const deleteUsername = req.params.username;
  const username = req.username;

  if (deleteUsername !== username)
    return res.status(401).json({ "message": "Forbidden request" });

  const deleteUser = await User.findOne({ "username": deleteUsername });

  if (!deleteUser)
    return res.status(404).json({
      "message": `Could not find user with ${deleteUsername} username`,
    });

  await User.findOneAndDelete({ "username": deleteUsername });

  const users = await User.find().exec();

  res.status(200).json({
    "message": `User ${deleteUser.username} deleted successfully`,
    "data": users,
  });
};
