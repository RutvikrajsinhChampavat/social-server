import mongoose from "mongoose";

const Schema = mongoose.Schema;

const postSchema = new Schema({
  user: {
    type: String,
    required: true,
  },
  imageURL: { type: String, default: null },
  caption: { type: String, default: null },
  commentBatchID: { type: Number, default: null },
  likeCount: { type: Number, default: 0 },
  isLiked: { type: Boolean, default: false },
  location: { type: String, default: null },
  postedOn: { type: Date, default: new Date() },
});

export const Post = mongoose.model("Post", postSchema);
