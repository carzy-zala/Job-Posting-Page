import { Schema, model } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const compnaySchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: true,
  },
  email: {
    type: String,
    trim: true,
    unique: true,
    required: true,
  },
  phoneNo: {
    type: String,
    unique: true,
    required: true,
  },
  companyName: {
    type: String,
    trim: true,
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  employee: {
    type: String,
    default: "0",
    required: true,
  },
  refreshToken: {
    type: String,
  },
});

//#region generate tokens

compnaySchema.methods.generateAccessToken = function () {

  return jwt.sign(
    {
      id: this.id,
      companyName: this.username,
      email: this.email,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_TIME,
    },
  );
};

compnaySchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      id: this.id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_TIME,
    },
  );
};

//#endregion

export const Company = model("Company", compnaySchema);
