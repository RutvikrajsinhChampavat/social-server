import express from "express";
import { ROLES } from "../config/roles_list";
import {
  followUser,
  getFollowers,
  getFollowing,
  unFollowUser,
} from "../controllers/relationController";
import { verifyRoles } from "../middleware/verifyRoles";

const relationRouter = express.Router();

relationRouter.route("/following").get(verifyRoles(ROLES.user), getFollowing);
relationRouter.route("/followers").get(verifyRoles(ROLES.user), getFollowers);

relationRouter
  .route("/:username")
  .post(verifyRoles(ROLES.user), followUser)
  .put(verifyRoles(ROLES.user), unFollowUser);

export default relationRouter;
