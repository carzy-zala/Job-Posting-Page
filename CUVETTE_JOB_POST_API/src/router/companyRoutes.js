import { Router } from "express";
import {
  register,
  login,
  verifyCompany,
  verifyEmailOTP,
  logoutCompany,
} from "../controller/company.controller.js";
import { verifyJWT } from "../middelware/auth.middelware.js";

const companyRoute = Router();

companyRoute.route("/register").post(register);
companyRoute.route("/verify/:companyId").get(verifyCompany);
companyRoute.route("/verify/email").post(verifyEmailOTP);
companyRoute.route("/login").post(login);
companyRoute.route("/logout").get(verifyJWT, logoutCompany);

export default companyRoute;
