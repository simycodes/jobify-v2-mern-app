import mongoose from "mongoose";
import { JOB_STATUS, JOB_TYPE } from "../utils/constants.js";

const jobSchema = new mongoose.Schema(
  {
    company: String,
    position: String,
    jobStatus: {
      type: String,
      enum: [
        JOB_STATUS.INTERVIEW,
        JOB_STATUS.DECLINED,
        JOB_STATUS.PENDING,
        JOB_STATUS.ACCEPTED,
      ],
      default: JOB_STATUS.PENDING,
    },
    jobType: {
      type: String,
      enum: Object.values(JOB_TYPE), // enum: [JOB_TYPE.FULL_TIME, JOB_TYPE.PART_TIME, JOB_TYPE.INTERNSHIP],
      default: JOB_TYPE.FULL_TIME,
    },
    jobLocation: {
      type: String,
      default: "my city",
    },
    createdBy: {
      // Connect User model to the Job model
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true, // Shows created at and updated at values in the database
  }
);

// Convert the schema into a model when exporting the schema
// mongoose.model("Job") also creates a collection in the database but becomes plural "jobs"
export default mongoose.model("Job", jobSchema);
