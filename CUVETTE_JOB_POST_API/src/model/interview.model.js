import { Schema, model } from "mongoose";

const interviewSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  experienceLevel: {
    type: String,
    enum: ["0-2 Years", "2-5 Years", "5-10 Years", "10+ Years"],
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  invitedCandidates: [String],
});

const Interview = model("Interview", interviewSchema);

export default Interview;
