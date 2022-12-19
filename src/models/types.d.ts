import { Request } from "express";

interface USER {
  "username": string;
  "password": string;
  "avatat"?: string;
  "postcount": number;
  "followercount": number;
  "followingcount": number;
  "bio"?: string;
  "refreshToken"?: string;
  "roles": { "user": number; "admin"?: number };
}

interface ROLE {
  "user": number;
  "admin"?: number;
}

interface CustomRequest extends Request {
  "username"?: string;
  "roles"?: Array<number>;
}

interface POST {
  "user": string;
  "imageURL": string;
  "caption"?: string;
  "commentBatchID"?: number;
  "likeCount": number;
  "isLiked": boolean;
  "location"?: string;
  "postedOn": Date;
}

interface COMMENT {
  "commentID": string;
  "username": string;
  "text": string;
  "likecount": number;
  "postedOn": Date;
  "isliked": boolean;
}

interface COMMENTS {
  "postid": string;
  "comments"?: Array<COMMENT>;
}
