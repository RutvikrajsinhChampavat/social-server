import express from "express";
import { ROLES } from "../config/roles_list";
import {
  deleteUser,
  getUsers,
  getUser,
  updateUser,
} from "../controllers/userController";
import { verifyRoles } from "../middleware/verifyRoles";

const userRouter = express.Router();

userRouter.get("/", verifyRoles(ROLES.user, ROLES.user), getUsers);

userRouter
  .route("/:id")
  .get(verifyRoles(ROLES.user, ROLES.user), getUser)
  .put(verifyRoles(ROLES.user, ROLES.user), updateUser)
  .delete(verifyRoles(ROLES.admin), deleteUser);

export default userRouter;
