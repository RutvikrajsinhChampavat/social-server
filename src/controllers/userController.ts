import { Request, Response } from "express";
import { Relation } from "../models/Following";
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

  const userData = {
    "username": user.username,
    "fullName": user.fullname,
    "avatar": user.avatar,
    "postCount": user.postcount,
    "followingCount": user.followingcount,
    "followersCount": user.followercount,
  };

  res
    .status(200)
    .json({ "message": "User fetched successfully!", "data": userData });
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

export const followUser = async (req: CustomRequest, res: Response) => {
  const followUser = req.params.username;
  const username = req.username;

  if (followUser === username)
    return res.status(400).json({ "message": "You can not follow yourself" });

  try {
    const userRelatoins = await Relation.findOne({ "user": username });
    const followUserRelatoins = await Relation.findOne({ "user": followUser });

    if (userRelatoins?.following?.includes(followUser))
      return res
        .status(400)
        .json({ "message": `You are already following ${followUser}` });

    if (userRelatoins?.user) {
      userRelatoins?.following.push(followUser);

      await Relation.updateOne(
        { "user": username },
        {
          $set: {
            "following": userRelatoins?.following,
          },
        }
      );

      const updatedRelatoins = await Relation.findOne({ "user": username });

      res.status(200).json({
        "message": "Successfully follwed user",
        "data": updatedRelatoins,
      });
    } else {
      const newUserRelation = await Relation.create({
        "user": username,
        "following": [followUser],
        "followers": [],
      });

      res.status(200).json({
        "message": "Successfully follwed user",
        "data": newUserRelation,
      });
    }

    if (followUserRelatoins?.user) {
      followUserRelatoins?.followers.push(username);

      await Relation.updateOne(
        { "user": followUser },
        {
          $set: {
            "followers": followUserRelatoins?.followers,
          },
        }
      );
    } else {
      await Relation.create({
        "user": followUser,
        "following": [],
        "followers": [username],
      });
    }
  } catch (error: any) {
    res
      .status(400)
      .json({ "message": `Error while follwing user ${error.message}` });
  }
};

export const getFollowing = async (req: CustomRequest, res: Response) => {
  const username = req.username;

  try {
    const relation = await Relation.findOne({ "user": username });

    res.status(200).json({
      "message": "Successfully fetched followers",
      "data": relation?.following,
    });
  } catch (error: any) {
    res.status(400).json({
      "message": `Something went wrong while getting following users : ${error.message}`,
    });
  }
};

export const unFollowUser = async (req: CustomRequest, res: Response) => {
  const unFollowUser = req.params.username;
  const username = req.username;

  if (unFollowUser === username)
    return res.status(400).json({ "message": "You can not unfollow yourself" });

  try {
    const relatoins = await Relation.findOne({ "user": username });

    if (!relatoins?.following?.includes(followUser))
      return res.status(400).json({
        "message": `You are not following ${unFollowUser}`,
      });

    const updatedFollowings = relatoins?.following.filter(
      (user) => user !== unFollowUser
    );

    await Relation.updateOne(
      { "user": username },
      { $set: { "following": updatedFollowings } },
      { upsert: true }
    );

    const updatedRelatoins = await Relation.findOne({ "user": username });

    res.status(200).json({
      "message": "Successfully unfollowed",
      "data": updatedRelatoins,
    });
  } catch (error: any) {
    res.status(400).json({
      "message": `Something went wrong while unfollowing : ${error.message}`,
    });
  }
};

export const getFollowers = async (req: CustomRequest, res: Response) => {
  const username = req.username;

  try {
    const relation = await Relation.findOne({ "user": username });

    res.status(200).json({
      "message": "Successfully fetched followers",
      "data": relation?.followers,
    });
  } catch (error: any) {
    res.status(400).json({
      "message": `Something went wrong while getting following users : ${error.message}`,
    });
  }
};
