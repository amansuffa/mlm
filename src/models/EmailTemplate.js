import mongoose from "mongoose";

// const EmailTemplateSchema = new mongoose.Schema({
//   name: String,
//   subject: String,
//   body: String,
//   ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
//   isDefault: { type: Boolean, default: false } // <-- new field
// }, { timestamps: true });


const emailTemplateSchema = new mongoose.Schema({
  name: { type: String, required: true }, 
  type: { type: String, required: true }, 
  subject: { type: String, required: true },
  body: { type: String, required: true }, 
}, { timestamps: true });


export const EmailTemplate = mongoose.models.EmailTemplate || mongoose.model("EmailTemplate", EmailTemplateSchema);
