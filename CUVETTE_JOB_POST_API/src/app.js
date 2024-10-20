import dotenv from "dotenv";

dotenv.config({
  path: "./.env",
});

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

// app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

// Routers
import companyRoute from "./router/companyRoutes.js";
import interviewRoute from "./router/interviewRoute.js";


app.use("/api/v1/company", companyRoute);
app.use("/api/v1/interview", interviewRoute);

import ApiError from "./util/ApiError.js";

app.use((err, req, res, next) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: err.success,
      statusCode: err.statusCode,
      message: err.message,
      errors: err.errors,
    });
  }
});

export { app };
