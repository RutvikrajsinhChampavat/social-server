import express from "express";
import { ROLES } from "../config/roles_list";
import {
  deleteUser,
  getUsers,
  getUser,
  updateUser,
  getProfile,
} from "../controllers/userController";
import { verifyRoles } from "../middleware/verifyRoles";

const userRouter = express.Router();

userRouter
  .route("/")
  .get(verifyRoles(ROLES.user, ROLES.user), getUsers)
  .put(verifyRoles(ROLES.user, ROLES.user), updateUser);

userRouter.route("/profile").get(verifyRoles(ROLES.user), getProfile);

userRouter
  .route("/:username")
  .get(verifyRoles(ROLES.user, ROLES.user), getUser)
  .delete(verifyRoles(ROLES.admin), deleteUser);

export default userRouter;
