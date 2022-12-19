import { CustomRequest } from "../models/types";
import { Request, Response } from "express";
import { Post } from "../models/Post";

export const addPost = async (req: CustomRequest, res: Response) => {
  const username = req.username;
  const { image, caption, location } = req.body;

  if (!image) return res.status(400).json({ "messsage": "Image is required" });

  try {
    const newPost = await Post.create({
      "user": username,
      "imageURL": image,
      "caption": caption || null,
      "location": location || null,
    });

    res
      .status(200)
      .json({ "message": "Post created successfully", "data": newPost });
  } catch (error: any) {
    res.status(400).json({
      "message": `Something went wrong while creating post : ${error.message}`,
    });
  }
};

export const getUserPosts = async (req: CustomRequest, res: Response) => {
  const username = req.username;
  const paramUser = req.params.username;

  try {
    const userPosts = await Post.find({ "user": paramUser || username });

    res
      .status(200)
      .json({ "message": "Posts fetched successfully", "data": userPosts });
  } catch (error: any) {
    res.status(400).json({
      "message": `Somethinh went wrong while fetched posts : ${error.message}`,
    });
  }
};

export const getPost = async (req: Request, res: Response) => {
  const postID = req.params.id;

  try {
    const post = await Post.findOne({ "_id": postID });

    if (!post)
      return res
        .status(400)
        .json({ "message": "Could not find requested post" });

    res
      .status(200)
      .json({ "message": "Post fetched successfully", "data": post });
  } catch (error: any) {
    res.status(400).json({
      "message": `Something went wrong while fetching post : ${error.message}`,
    });
  }
};

export const deletePost = async (req: CustomRequest, res: Response) => {
  const user = req.username;
  const postID = req.params.id;

  try {
    const post = await Post.findOne({ "_id": postID });

    if (post?.user !== user)
      return res.status(400).json({ "message": "Forbidden request" });

    await Post.deleteOne({ "_id": postID });

    const posts = await Post.find({ "user": user });

    res
      .status(200)
      .json({ "message": "Post deleted successfully", "data": posts });
  } catch (error: any) {
    res.status(400).json({
      "message": `Something went wrong while deleting post : ${error.message}`,
    });
  }
};

export const getFollowingPosts = async (req: Request, res: Response) => {
  const follwingUsers = req.body.users;

  try {
    const posts = await Post.find({ "user": follwingUsers });

    res
      .status(200)
      .jsonp({ "message": "Posts fetched successfully", "data": posts });
  } catch (error: any) {
    res.status(400).json({
      "message": `Something went wrong while fetching following posts : ${error.message}`,
    });
  }
};

export const updatePost = async (req: CustomRequest, res: Response) => {
  const postID = req.params.id;
  const user = req.username;
  const { caption, location } = req.body;

  try {
    const post = await Post.findOne({ "_id": postID });

    if (post?.user !== user)
      return res.status(400).json({ "message": "Forbidden request" });

    await Post.updateOne(
      { "_id": postID },
      {
        $set: {
          "caption": caption || post?.caption,
          "location": location || post?.location,
        },
      },
      { upsert: true }
    );

    const udatedPost = await Post.findOne({ "_id": postID });

    res
      .status(200)
      .json({ "message": "Post updated successfully", "data": udatedPost });
  } catch (error: any) {
    res.status(400).json({
      "message": `Something went wrong while deleting post : ${error.message}`,
    });
  }
};
