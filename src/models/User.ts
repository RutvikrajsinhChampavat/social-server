import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    dropDups: true,
  },
  fullname: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
  },
  postcount: {
    type: Number,
  },
  followercount: {
    type: Number,
  },
  followingcount: {
    type: Number,
  },
  bio: {
    type: String,
  },
  password: { type: String, required: true },
  refreshtoken: { type: String },
  roles: {
    user: {
      type: Number,
      default: 2001,
      required: true,
    },
    admin: { type: Number },
  },
});

export const User = mongoose.model("User", userSchema);
