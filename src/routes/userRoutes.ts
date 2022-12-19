import express from "express";
import { ROLES } from "../config/roles_list";
import {
  deleteUser,
  getUsers,
  getUser,
  updateUser,
  followUser,
  unFollowUser,
  getFollowing,
  getFollowers,
} from "../controllers/userController";
import { verifyRoles } from "../middleware/verifyRoles";

const userRouter = express.Router();

userRouter
  .route("/")
  .get(verifyRoles(ROLES.user, ROLES.user), getUsers)
  .put(verifyRoles(ROLES.user, ROLES.user), updateUser);

userRouter.route("/following").get(verifyRoles(ROLES.user), getFollowing);

userRouter.route("/followers").get(verifyRoles(ROLES.user), getFollowers);

userRouter
  .route("/:username")
  .get(verifyRoles(ROLES.user, ROLES.user), getUser)
  .delete(verifyRoles(ROLES.admin), deleteUser)
  .post(verifyRoles(ROLES.user), followUser)
  .put(verifyRoles(ROLES.user), unFollowUser);

export default userRouter;
