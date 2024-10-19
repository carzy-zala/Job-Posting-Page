import { Router } from "express";
import { addInterview } from "../controller/interview.controller.js";

const interviewRoute = Router();

interviewRoute.route("/addInterview").post(addInterview);

export default interviewRoute;
