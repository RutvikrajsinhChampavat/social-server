import mongoose from "mongoose";
const Schema = mongoose.Schema;

export interface RELATION_USER {
  username: string;
  avatar: string | null;
}

const relationSchema = new Schema({
  user: {
    type: String,
    required: true,
  },
  following: { type: Array, default: [] },
  followers: { type: Array, default: [] },
});

export const Relation = mongoose.model("Relations", relationSchema);
