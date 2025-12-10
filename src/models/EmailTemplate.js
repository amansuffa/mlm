import mongoose from "mongoose";

const emailTemplateSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, unique: true },
    category: {
      type: String,
      required: true,
    },
    subject: { type: String, required: true },
    body: { type: String, required: true },
    isDefault: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const EmailTemplate =
  mongoose.models?.EmailTemplate ||
  mongoose.model("EmailTemplate", emailTemplateSchema);
