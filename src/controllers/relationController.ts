/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Response } from "express";
import { Relation, RELATION_USER } from "../models/Following";
import { CustomRequest } from "../models/types";
import { User } from "../models/User";

export const followUser = async (req: CustomRequest, res: Response) => {
  const followUser = req.params.username;
  const username = req.username;

  if (followUser === username)
    return res.status(400).json({ "message": "You can not follow yourself" });

  const followUserInDB = await User.findOne({ "username": followUser });
  const userInDB = await User.findOne({ "username": username });

  if (!followUserInDB?.username)
    return res
      .status(404)
      .json({ "message": `Could not find user with username ${followUser}` });

  try {
    const userRelatoins = await Relation.findOne({ "user": username });
    const followUserRelatoins = await Relation.findOne({ "user": followUser });

    if (
      userRelatoins?.following?.some(
        (user: RELATION_USER) => user.username === followUser
      )
    )
      return res
        .status(400)
        .json({ "message": `You are already following ${followUser}` });

    if (userRelatoins?.user) {
      const followUserObj = {
        username: followUserInDB?.username,
        avatar: followUserInDB?.avatar,
      };

      userRelatoins?.following?.push(followUserObj);

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
      const followUserObj = {
        username: followUserInDB?.username,
        avatar: followUserInDB?.avatar,
      };

      const newUserRelation = await Relation.create({
        "user": username,
        "following": [followUserObj],
        "followers": [],
      });

      res.status(200).json({
        "message": "Successfully followed user",
        "data": newUserRelation,
      });
    }

    if (followUserRelatoins?.user) {
      const userObj = {
        username: userInDB?.username,
        avatar: userInDB?.avatar,
      };

      followUserRelatoins?.followers?.push(userObj);

      await Relation.updateOne(
        { "user": followUser },
        {
          $set: {
            "followers": followUserRelatoins?.followers,
          },
        }
      );
    } else {
      const userObj = {
        username: userInDB?.username,
        avatar: userInDB?.avatar,
      };

      await Relation.create({
        "user": followUser,
        "following": [],
        "followers": [userObj],
      });
    }
  } catch (error: any) {
    res
      .status(400)
      .json({ "message": `Error while follwing user ${error.message}` });
  }
};

export const unFollowUser = async (req: CustomRequest, res: Response) => {
  const unFollowUser = req.params.username;
  const username = req.username;

  if (unFollowUser === username)
    return res.status(400).json({ "message": "You can not unfollow yourself" });

  try {
    const relatoins = await Relation.findOne({ "user": username });

    if (
      !relatoins?.following?.some(
        (user: RELATION_USER) => user.username === unFollowUser
      )
    )
      return res.status(400).json({
        "message": `You are not following ${unFollowUser}`,
      });

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment

    const updatedFollowings = relatoins?.following.filter(
      (user: RELATION_USER) => user.username !== unFollowUser
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
