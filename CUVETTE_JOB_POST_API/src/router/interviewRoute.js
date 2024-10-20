import { Router } from "express";
import {
  addInterview,
  deleteInterview,
  getInterviews,
} from "../controller/interview.controller.js";
import { verifyJWT } from "../middelware/auth.middelware.js";

const interviewRoute = Router();

interviewRoute.route("/addInterview").post(verifyJWT,addInterview);
interviewRoute.route("/").get(verifyJWT, getInterviews);
interviewRoute.route("/delete/:interviewId").delete(verifyJWT, deleteInterview);

export default interviewRoute;
