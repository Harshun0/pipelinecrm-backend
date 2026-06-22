import mongoose from "mongoose";

const STAGES = ["New", "Contacted", "Qualified", "Proposal Sent", "Won", "Lost"];
const PRIORITIES = ["Low", "Medium", "High"];

const opportunitySchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    customerName: {
      type: String,
      required: [true, "Customer name is required"],
      trim: true,
    },
    contactName: { type: String, trim: true },
    contactEmail: { type: String, trim: true, lowercase: true },
    contactPhone: { type: String, trim: true },
    requirement: {
      type: String,
      required: [true, "Requirement is required"],
      trim: true,
    },
    estimatedValue: {
      type: Number,
      min: [0, "Estimated value must be non-negative"],
      default: null,
    },
    stage: {
      type: String,
      enum: STAGES,
      default: "New",
    },
    priority: {
      type: String,
      enum: PRIORITIES,
      default: "Medium",
    },
    nextFollowUpDate: { type: Date, default: null },
    notes: { type: String, trim: true, default: "" },
  },
  { timestamps: true },
);

const Opportunity = mongoose.model("Opportunity", opportunitySchema);

export default Opportunity;
