import express from "express";
import {
  addTest,
  deleteTest,
  getAllTest,
  getTest,
  updateTest,
} from "../controllers/testController";

const testRouter = express.Router();

testRouter
  .route("/success")
  .get(getAllTest)
  .post(addTest)
  .put(updateTest)
  .delete(deleteTest);

testRouter.route("/success/:id").get(getTest);

export default testRouter;
