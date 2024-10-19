import { Company } from "../model/company.model.js";
import ApiError from "../util/ApiError.js";
import asyncHandler from "../util/asyncHandler.js";
import jwt from "jsonwebtoken";

export const verifyJWT = asyncHandler(async (req, _, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "ERROR :: Unauthorized request !!");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const company = await Company.findById(decodedToken?.id);

    if (!company) {
      throw new ApiError(401, "ERROR :: Please register with us !!");
    }

    req.company = company;
    next();
  } catch (error) {
    throw new ApiError(
      401,
      error?.message || "ERROR :: Invalid access token !!",
    );
  }
});
