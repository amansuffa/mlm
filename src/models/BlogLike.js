import mongoose from "mongoose";

const BlogLikeSchema = new mongoose.Schema(
  {
    blogId: { type: mongoose.Schema.Types.ObjectId, ref: "Blog", required: true },
    ip: { type: String, required: true },
  },
  { timestamps: true }
);

BlogLikeSchema.index({ blogId: 1, ip: 1 }, { unique: true });

export const BlogLike =
  mongoose.models.BlogLike || mongoose.model("BlogLike", BlogLikeSchema);
