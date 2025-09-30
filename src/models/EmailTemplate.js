import mongoose from "mongoose";

const EmailTemplateSchema = new mongoose.Schema({
  title: String,
  subject: String,
  body: String,
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  isDefault: { type: Boolean, default: false } // <-- new field
}, { timestamps: true });


export const EmailTemplate = mongoose.models.EmailTemplate || mongoose.model("EmailTemplate", EmailTemplateSchema);
