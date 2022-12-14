import express from "express";
import {
  deleteUser,
  getUsers,
  getUser,
  updateUser,
} from "../controllers/userController";

const userRouter = express.Router();

userRouter.get("/", getUsers);

userRouter.route("/:id").put(updateUser).delete(deleteUser).get(getUser);

export default userRouter;
