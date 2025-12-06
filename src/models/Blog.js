import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Basic Info
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    excerpt: {
      type: String,
      trim: true,
      default: "",
    },
    content: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      trim: true,
      default: "",
    },

    // SEO & Tags
    tags: {
      type: [String], // store as array of tags
      default: [],
    },
    keywords: {
      type: [String], 
      default: [],
    },

    // Media
    thumbnail: {
      type: String, 
      default: "",
    },
    images: {
      type: [String],
      default: [],
    },
    videos: {
      type: [String],
      default: [],
    },
    videoLinks: {
      type: [String],
      default: [],
    },

    // Sharing info
    shares: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        sharedAt: { type: Date, default: Date.now },
      },
    ],

    //  Stats (optional future use)
    views: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export const Blog = mongoose.models.Blog || mongoose.model("Blog", blogSchema);
