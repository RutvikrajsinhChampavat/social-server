import mongoose from "mongoose";
const Schema = mongoose.Schema;

const relationSchema = new Schema({
  user: {
    type: String,
    required: true,
  },
  following: { type: Array, default: [] },
  followers: { type: Array, default: [] },
});

export const Relation = mongoose.model("Relations", relationSchema);
