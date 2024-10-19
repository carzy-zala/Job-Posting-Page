import { Schema, model } from "mongoose";

const otpSchema = new Schema({
  companyId: {
    type: Schema.Types.ObjectId,
    ref: "Company",
  },
  otp: {
    type: String,
    required: true,
  },
});

export const OTP = model("OTP", otpSchema);
