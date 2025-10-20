import mongoose from "mongoose";

const BlogViewSchema = new mongoose.Schema(
  {
    blogId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
      required: true,
    },
    ip: { type: String, required: true },
  },
  { timestamps: true }
);

BlogViewSchema.index({ blogId: 1, ip: 1 }, { unique: true }); 

export const BlogView =
  mongoose.models.BlogView || mongoose.model("BlogView", BlogViewSchema);
